
import sys
from fontTools.ttLib import TTFont
import os
import shutil
from biplist import readPlist, writePlist
import json
from wiimupbxproj import WiimuPbxproj

ROOTPATH = os.path.abspath(
    "%s/../" % os.path.dirname(os.path.realpath(__file__)))
# Post name是iOS引用字体family的名字
FONT_POSTSCRIPT_NAME_ID = 6

# 获取字体文件postScriptName


def getFontPostScriptName(fontPath):
    if os.path.isfile(fontPath) == False:
        raise Exception('Font not exist')

    fileType = os.path.splitext(fontPath)[-1]
    if fileType != '.ttf' and fileType != '.otf':
        raise Exception('Font postScriptName Not exist')
    font = TTFont(fontPath)
    postScriptName = ''
    for record in font['name'].names:
        text = record.string.decode("utf-8")
        if record.nameID == FONT_POSTSCRIPT_NAME_ID and not postScriptName:
            postScriptName = text
        if postScriptName:
            break
    if postScriptName:
        return postScriptName
    else:
        raise Exception('Font postScriptName Not exist')


def addFontToIOS(fontPath, postScriptName):
    projectName = getProjectName()
    # 拷贝文件
    fontType = os.path.splitext(fontPath)[-1]
    iOSFontPath = os.path.abspath(
        "%s/ios/Resource/Fonts" % (ROOTPATH))
    dir_path = os.path.abspath(
        "%s/ios" % ROOTPATH)

    if not os.path.exists(iOSFontPath):
        os.makedirs(iOSFontPath)
        projectObj = WiimuPbxproj(dir_path)
        projectObj.addGroupRef(projectName+'/Resource')
        projectObj.flush()
        projectObj.refreshPbxProjFile()
        projectObj.addGroupRef(projectName+'/Resource/Fonts')
        projectObj.flush()
        projectObj.refreshPbxProjFile()
    iOSFontPath = os.path.join(iOSFontPath, postScriptName + fontType)

    shutil.copyfile(fontPath, iOSFontPath)
    projectObj = WiimuPbxproj(dir_path)
    # 添加Ref
    refPath = projectName+'/Resource/Fonts/' + postScriptName + fontType
    projectObj.addFileRef(refPath)
    refId = projectObj.getReferenceId(refPath)
    projectObj.checkFile(refPath, refId, projectObj.mainTarget.name)
    projectObj.flush()


def getProjectName():
    packageJsonPath = os.path.abspath(
        "%s/package.json" % ROOTPATH)
    if (os.path.exists(packageJsonPath) == False):
        raise Exception('package.json not found:'+packageJsonPath)
    load_dict = None
    with open(packageJsonPath) as load_f:
        load_dict = json.load(load_f)
    projectName = load_dict['name']
    return projectName


def addFontToAndroid(fontPath, postScriptName):

    fontType = os.path.splitext(fontPath)[-1]
    androidFontPath = os.path.abspath(
        "%s/android/app/src/main/assets/fonts" % ROOTPATH)
    if not os.path.exists(androidFontPath):
        os.makedirs(androidFontPath)
    androidFontPath = os.path.join(androidFontPath, postScriptName + fontType)
    shutil.copyfile(fontPath, androidFontPath)


def parseAPPFont():
    fontConfigPath = os.path.abspath(
        "%s/src/Resources/Fonts/fontConfig.json" % ROOTPATH)
    if (os.path.exists(fontConfigPath) == False):
        raise Exception('Not found config')
    load_dict = None
    with open(fontConfigPath) as load_f:
        load_dict = json.load(load_f)
    fonts = load_dict['fonts']
    fontDirPath = os.path.abspath(
        "%s/src/Resources/Fonts/Files" % ROOTPATH)
    projectName = getProjectName()
    plistPath = os.path.abspath(
        "%s/ios/%s/info.plist" % (ROOTPATH, projectName))
    infoPlist = readPlist(plistPath)

    oldAppUIFonts = infoPlist.get('UIAppFonts', [])
    newUIAppFonts = oldAppUIFonts[:]

    fontConfigText = 'export default {'
    for font in fonts:
        fileName = font['fileName']
        fontName = font['fontType']
        fontPath = os.path.join(fontDirPath, fileName)
        if os.path.exists(fontPath) == False:
            print('Not found font file:' + fontPath)
            continue
        postScriptName = getFontPostScriptName(fontPath)
        if postScriptName:
            lineText = '\n    %s:"%s",' % (fontName, postScriptName)
            fontConfigText += lineText
            fileType = os.path.splitext(fontPath)[-1]
            newFontName = postScriptName + fileType
            if newFontName not in newUIAppFonts:
                newUIAppFonts.append(newFontName)
            addFontToIOS(fontPath, postScriptName)
            addFontToAndroid(fontPath, postScriptName)

    fontConfigText += '\n}'
    cfPath = os.path.abspath(
        "%s/src/Configs/ConfigFiles/fontConfigs.js" % ROOTPATH)
    with open(cfPath, 'w') as f:
        f.write(fontConfigText)

    infoPlist['UIAppFonts'] = newUIAppFonts
    try:
        writePlist(infoPlist, plistPath)
    except Exception as e:
        print(e)
        raise Exception("Write  Info plist Error")


if __name__ == '__main__':
    parseAPPFont()
