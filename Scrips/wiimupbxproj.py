# coding=utf-8

import sys
import os
import getopt
import shutil
import codecs
import re
import biplist
import subprocess
import json
from hashlib import md5 as hl_md5


from wiimutarget import wiimuTarget
import ipdb
invalid_file_type = -1
source_file_type = 0
resource_file_type = 1
header_file_type = 2

# pathType: build ref framework embedFramework


def unique_path(path, target, lan="en", pathType="build"):
    return pathType+path+target+lan


def md5_hex(a_str):
    return hl_md5(a_str.encode('utf-8')).hexdigest().upper()


RefTypeExtensionDic = {
    "m": "sourcecode.c.objc",
    "mm": "sourcecode.cpp.objcpp",
    "c": "sourcecode.c.c",
    "plist": "text.plist.xml",
    "gif": "image.gif",
    "png": "image.png",
    "xib": "file.xib",
    "strings": "text.plist.strings",
    "xcassets": "folder.assetcatalog",
    "h": "sourcecode.c.h",
    "pch": "sourcecode.c.h",
    "otf": "file",
    "ttf": "file",
    "xcdatamodel": "wrapper.xcdatamodel"
}


class WiimuPbxproj(object):
    def __init__(self, projectPath):
        self.projectPath = projectPath
        self.pbxprojPath = ''

        self.rootUid = ''
        self.mainGroupUid = ''
        self.objsJson = {}

        self.pbxprojContent = ""

        # 暂时修改ref id，但未重新读入
        self.cacheReferenceInfo = {}

        # 目前仅有一个target，但还是要考虑多target的情况
        # 默认第一个target就是mainTarget
        self.mainTarget = None

        for filename in os.listdir(projectPath):
            if filename.endswith('.xcodeproj'):
                self.pbxprojPath = '%s/%s/project.pbxproj' % (
                    projectPath, filename)
                break

        if len(self.pbxprojPath) == 0:
            raise Exception('Invalid project path: %s' % projectPath)

        self.refreshPbxProjFile()

    def refreshPbxProjFile(self):
        # 工程文件本质上是个plist
        # 但用plist的库编辑的话，其中的注释信息等就都丢了
        # 所以还是用正则来搞
        pbproj_to_json_cmd = ['plutil', '-convert',
                              'json', '-o', '-', self.pbxprojPath]
        json_str = subprocess.check_output(pbproj_to_json_cmd)
        jsonObj = json.loads(json_str)

        self.rootUid = jsonObj['rootObject']
        self.objsJson = jsonObj['objects']

        rootJson = self.objsJson[self.rootUid]
        self.mainGroupUid = rootJson['mainGroup']

        # targets
        self.targets = {}
        self.mainTarget = None
        for targetUid in rootJson['targets']:
            target = wiimuTarget(targetUid, self.objsJson)
            self.targets[target.name] = target

            if self.mainTarget is None:
                self.mainTarget = target

        with codecs.open(self.pbxprojPath, "r", 'utf-8', errors='ignore') as fileObj:
            self.pbxprojContent = fileObj.read()

    def flush(self):
        with codecs.open(self.pbxprojPath, "w", 'utf-8', errors='ignore') as fileObj:
            fileObj.write(self.pbxprojContent)

    # 勾选target，即在工程中，但是不在编译中
    def checkFile(self, relativePath, referenceId, target):
        if not referenceId:
            referenceId = self.getReferenceId(relativePath, None)

            if referenceId == None:
                raise Exception('No file found in project')

        targetObj = self.targets.get(target)
        if targetObj == None:
            raise Exception('No target named %s' % target)

        if targetObj.buildIdForRefId(referenceId) != None:
            print('File already in build phase')
            return

        filename = os.path.basename(relativePath)
        buildType = self.fileBuildType(filename)

        buildId = md5_hex(unique_path(relativePath, target))
        buildTypeStr = ''
        phaseUid = ''

        if buildType == source_file_type:
            buildTypeStr = 'Sources'
            phaseUid = targetObj.sourceUid
        elif buildType == resource_file_type:
            buildTypeStr = 'Resources'
            phaseUid = targetObj.resourceUid
        else:
            raise Exception('No support for file %s' % filename)

        # 修改PBXBuildFile section
        content = self.pbxprojContent
        buildComment = re.search(
            r'/\* Begin PBXBuildFile section \*/', content)
        content = content[:buildComment.end()] + '\n		' + '%s /* %s in %s */ = {isa = PBXBuildFile; fileRef = %s /* %s */; };' % (
            buildId, filename, buildTypeStr, referenceId, filename) + content[buildComment.end():]

        # 修改PBXResourcesBuildPhase section
        buildComment = re.search(
            r'%s /\* %s \*/ = {.*?files = \(' % (phaseUid, buildTypeStr), content, re.S)
        content = content[:buildComment.end()] + '\n				' + '%s /* %s in %s */,' % (
            buildId, filename, buildTypeStr) + content[buildComment.end():]

        self.pbxprojContent = content

    # 勾选所有targets

    def checkFileAllTargets(self, relativePath):
        referenceId = self.getReferenceId(relativePath, None)
        if referenceId == None:
            raise Exception('No file found in project')

        # 修改PBXBuildFile section
        content = self.pbxprojContent

        for targetObj in self.targets.values():
            if targetObj.buildIdForRefId(referenceId) != None:
                print('File already in build phase %s' % targetObj.name)
                continue

            print('check %s ...' % targetObj.name)
            filename = os.path.basename(relativePath)
            buildType = self.fileBuildType(filename)

            buildId = md5_hex(unique_path(relativePath, targetObj.name))
            buildTypeStr = ''
            phaseUid = ''

            if buildType == source_file_type:
                buildTypeStr = 'Sources'
                phaseUid = targetObj.sourceUid
            elif buildType == resource_file_type:
                buildTypeStr = 'Resources'
                phaseUid = targetObj.resourceUid
            else:
                raise Exception('No support for file %s' % filename)

            buildComment = re.search(
                r'/\* Begin PBXBuildFile section \*/', content)
            content = content[:buildComment.end()] + '\r\n		' + '%s /* %s in %s */ = {isa = PBXBuildFile; fileRef = %s /* %s */; };' % (
                buildId, filename, buildTypeStr, referenceId, filename) + content[buildComment.end():]

            # 修改PBXResourcesBuildPhase section
            buildComment = re.search(
                r'%s /\* %s \*/ = {.*?files = \(' % (phaseUid, buildTypeStr), content, re.S)
            content = content[:buildComment.end()] + '\r\n				' + '%s /* %s in %s */,' % (
                buildId, filename, buildTypeStr) + content[buildComment.end():]

        self.pbxprojContent = content

    def uncheckFile(self, relativePath, target):
        refId = self.getReferenceId(relativePath, None)
        if refId == None:
            raise Exception('No file found in project')

        targetObj = self.targets.get(target)
        if targetObj == None:
            raise Exception('No target named %s' % target)

        buildId = targetObj.buildIdForRefId(refId)
        if buildId == None:
            print('No found in build phase')
            return

        self.pbxprojContent = re.sub(r'.*%s.*\n' %
                                     buildId, '', self.pbxprojContent)

    def uncheckFileWithBuildId(self, buildId):
        self.pbxprojContent = re.sub(
            r"[\t]+%s.*\n" % buildId, '', self.pbxprojContent)

    def getReferenceId(self, relativePath, relativeGroupUid=None):
        if relativeGroupUid == None:
            relativeGroupUid = self.mainGroupUid

        refId = self.cacheReferenceInfo.get(relativePath, None)
        if refId:
            return refId

        pathArr = relativePath.split('/')
        jsonPathObj = self.objsJson[relativeGroupUid]
        nextPath = pathArr[0]

        jsonPathChildren = jsonPathObj.get('children')

        for jsonChildUid in jsonPathChildren:
            jsonChildObj = self.objsJson.get(jsonChildUid)

            # 有时有name 有时没有 path有时带路径 有时不带
            if jsonChildObj and (jsonChildObj.get('path') == nextPath or jsonChildObj.get('name') == nextPath):

                # print("%s %s" % (nextPath, jsonChildUid))

                if len(pathArr) == 1:
                    return jsonChildUid
                else:
                    return self.getReferenceId('/'.join(pathArr[1:]), jsonChildUid)

        return None

    def fileBuildType(self, filename):
        sourceType = ('m', 'mm', 'c', 'xcdatamodeld')
        resourceType = ('plist', 'png', "gif", 'xib', 'storyboard',
                        'strings', 'xcassets', 'der', 'xcconfig', 'otf', 'ttf')
        headerType = ('h', 'pch')

        arr = filename.split('.')
        if len(arr) == 2:
            extension = arr[-1:][0]
            if extension in sourceType:
                return source_file_type
            elif extension in resourceType:
                return resource_file_type
            elif extension in headerType:
                return headerType

        return invalid_file_type

    def addFileRef(self, path):
        baseName = os.path.basename(path)
        parentGroupUid = self.getReferenceId(os.path.dirname(path))
        parentGroupName = os.path.basename(os.path.dirname(path))

        content = self.pbxprojContent

        # insert under parent group's children
        beginSection = re.search(r"%s /\* %s \*/ = \{.*?isa = PBXGroup;.*?children = \(" % (
            parentGroupUid, parentGroupName), content, re.M | re.S)

        if not beginSection:
            print("Found no parentGroupName %s" % parentGroupName)
            return

        refId = md5_hex(unique_path(
            path=path, target="", lan="", pathType="ref"))
        if self.getReferenceId(path):
            print("%s already exists in ref" % path)
            return

        # 缓存
        self.cacheReferenceInfo[path] = refId

        content = content[:beginSection.end(
        )] + "\n				%s /* %s */," % (refId, baseName) + content[beginSection.end():]

        # insert under /* Begin PBXFileReference section */
        beginSection = re.search(
            r'/\* Begin PBXFileReference section \*/', content, re.S)

        arr = baseName.split('.')
        if len(arr) != 2:
            print("addFileRef %s fail, name invalid" % path)
            return

        extension = arr[-1:][0]
        typeStr = RefTypeExtensionDic.get(extension, None)

        if not typeStr:
            print("addFileRef %s fail, type invalid" % path)
            return

        content = content[:beginSection.end()] + "\n        %s /* %s */ = {isa = PBXFileReference; lastKnownFileType = %s; path = \"%s\"; sourceTree = \"<group>\"; };" % (
            refId, baseName, typeStr, baseName) + content[beginSection.end():]

        self.pbxprojContent = content

    def addLocalizationRef(self, path):
        if ".lproj/" not in path:
            print("addLocalizationRef %s invalid")
            return

        baseName = os.path.basename(path)
        parentGroupPath = os.path.dirname(os.path.dirname(path))
        parentGroupUid = self.getReferenceId(parentGroupPath)
        content = self.pbxprojContent

        # objRefId: 实体的refid，例如a.strings
        # lanRefId: 实体在语言下的id，例如a.strings/a.strings (German)
        objRefPath = os.path.join(parentGroupPath, baseName)
        # 从未添加过
        objRefId = self.getReferenceId(objRefPath)
        if not objRefId:
            objRefId = md5_hex(unique_path(
                path=objRefPath, target="", lan="", pathType="ref"))
            self.cacheReferenceInfo[objRefPath] = objRefId

            # insert under parent group's children
            beginSection = re.search(r"%s /\* %s \*/ = \{.*?isa = PBXGroup;.*?children = \(" % (
                parentGroupUid, os.path.basename(parentGroupPath)), content, re.M | re.S)
            content = content[:beginSection.end(
            )] + "\n				%s /* %s */," % (objRefId, baseName) + content[beginSection.end():]

            # 添加PBXVariantGroup
            beginSection = re.search(
                r'/\* Begin PBXVariantGroup section \*/', content, re.S)
            content = content[:beginSection.end()] + "\n		%s /* %s */ = {\n		isa = PBXVariantGroup;\n			children = (\n			);\n			name = %s;\n			sourceTree = \"<group>\";\n		};" % (
                objRefId, baseName, baseName) + content[beginSection.end():]

        # 处理lanref
        lanRefId = self.getReferenceId(path)
        if lanRefId:
            print("%s already in ref" % path)
            return

        # 向PBXVariantGroup中添加对应语言的文件
        lan = os.path.basename(os.path.dirname(path))[:-6]
        lanRefId = md5_hex(unique_path(
            path=path, target="", lan="", pathType="ref"))
        self.cacheReferenceInfo[path] = lanRefId
        beginSection = re.search(
            r"%s /\* %s \*/ = \{.*?isa = PBXVariantGroup;.*?children = \(" % (objRefId, baseName), content, re.M | re.S)
        content = content[:beginSection.end(
        )] + "\n				%s /* %s */," % (lanRefId, lan) + content[beginSection.end():]

        # 向PBXFileReference中添加
        beginSection = re.search(
            r'/\* Begin PBXFileReference section \*/', content, re.S)

        arr = baseName.split('.')
        if len(arr) != 2:
            print("addLocalizationRef %s fail, name invalid" % path)
            return

        extension = arr[-1:][0]
        typeStr = RefTypeExtensionDic.get(extension, None)

        if not typeStr:
            print("addFileRef %s fail, type invalid" % path)
            return

        content = content[:beginSection.end()] + "\n        %s /* %s */ = {isa = PBXFileReference; lastKnownFileType = %s; path = \"%s\"; sourceTree = \"<group>\"; };" % (
            lanRefId, lan, typeStr, "%s/%s" % (os.path.basename(os.path.dirname(path)), baseName)) + content[beginSection.end():]
        self.pbxprojContent = content

    def addGroupRef(self, path):
        baseName = os.path.basename(path)
        parentGroupUid = self.getReferenceId(os.path.dirname(path))
        parentGroupName = os.path.basename(os.path.dirname(path))

        content = self.pbxprojContent

        # insert under parent group's children
        beginSection = re.search(r"%s /\* %s \*/ = \{.*?isa = PBXGroup;.*?children = \(" % (
            parentGroupUid, parentGroupName), content, re.M | re.S)

        if not beginSection:
            print("Found no parentGroupName %s" % parentGroupName)
            return

        refId = md5_hex(unique_path(
            path=path, target="", lan="", pathType="ref"))
        if self.getReferenceId(path) == refId:
            print("%s already exists in ref" % path)
            return

        # 缓存
        self.cacheReferenceInfo[path] = refId

        content = content[:beginSection.end(
        )] + "\n				%s /* %s */," % (refId, baseName) + content[beginSection.end():]

        # create a new group
        beginSection2 = re.search(r'path = %s;.*?sourceTree = \"<group>\";.*?};' %
                                  parentGroupName, content[beginSection.end():], re.M | re.S)

        if not beginSection2:
            print("Found no  %s" % parentGroupName)
            return

        relativePos = beginSection.end() + beginSection2.end()
        content = content[:relativePos] + "\n		%s /* %s */ = {\n			isa = PBXGroup;\n			children = (\n			);\n			path = %s;\n			sourceTree = \"<group>\";\n		};" % (
            refId, baseName, baseName) + content[relativePos:]

        self.pbxprojContent = content

    def checkFramework(self, relativePath, referenceId, target, embed):
        if not referenceId:
            referenceId = self.getReferenceId(relativePath, None)
            if referenceId == None:
                raise Exception('No file found in project')

        targetObj = self.targets.get(target)
        if targetObj == None:
            raise Exception('No target named %s' % target)

        if targetObj.buildIdForRefId(referenceId) != None:
            print('File already in build phase %s' % relativePath)
            return

        filename = os.path.basename(relativePath)

        buildId = md5_hex(unique_path(relativePath, target,
                                      lan="", pathType="framework"))

        # 修改PBXBuildFile section
        content = self.pbxprojContent
        buildComment = re.search(
            r'/\* Begin PBXBuildFile section \*/', content)
        content = content[:buildComment.end()] + '\n		' + '%s /* %s in Frameworks */ = {isa = PBXBuildFile; fileRef = %s /* %s */; };' % (
            buildId, filename, referenceId, filename) + content[buildComment.end():]
        if embed:
            buildComment = re.search(
                r'/\* Begin PBXBuildFile section \*/', content)
            embedId = md5_hex(unique_path(relativePath, target,
                                          lan="", pathType="embedFramework"))
            content = content[:buildComment.end()] + '\n		' + '%s /* %s in Embed Frameworks */ = {isa = PBXBuildFile; fileRef = %s /* %s */; settings = {ATTRIBUTES = (CodeSignOnCopy, RemoveHeadersOnCopy, ); }; };' % (
                embedId, filename, referenceId, filename) + content[buildComment.end():]

        # 修改PBXFrameworksBuildPhase section
        frameworkComment = re.search(
            r'%s /\* Frameworks \*/ = {.*?files = \(' % targetObj.frameworkUid, content, re.S)
        content = content[:frameworkComment.end()] + '\r\n				' + '%s /* %s in Frameworks */,' % (
            buildId, filename) + content[frameworkComment.end():]

        # 修改PBXCopyFilesBuildPhase section
        if embed:
            embedId = md5_hex(unique_path(relativePath, target,
                                          lan="", pathType="embedFramework"))
            frameworkComment = re.search(
                r'%s /\* Embed Frameworks \*/ = {.*?files = \(' % targetObj.embedFrameworkUid, content, re.S)
            content = content[:frameworkComment.end()] + '\r\n				' + '%s /* %s in Embed Frameworks */,' % (
                embedId, filename) + content[frameworkComment.end():]

        self.pbxprojContent = content
