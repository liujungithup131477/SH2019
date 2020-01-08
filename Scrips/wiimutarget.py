# coding=utf-8

import sys
import os
import getopt


class wiimuTarget(object):
    def __init__(self, uid, jsonObjs):
        self.uid = uid
        self.jsonObjs = jsonObjs

        self.resourceUid = ''
        self.resourceFiles = []

        self.sourceUid = ''
        self.sourceFiles = []

        self.frameworkUid = ''
        self.frameworks = []
        self.embedFrameworkUid = ''

        self.debugBuildSettings = {}
        self.releaseBuildSettings = {}

        jsonObj = jsonObjs[uid]
        self.name = jsonObj['name']

        buildConfigurationIds = jsonObjs[jsonObj["buildConfigurationList"]
                                         ]["buildConfigurations"]
        self.debugBuildSettings = jsonObjs[buildConfigurationIds[0]
                                           ]["buildSettings"]
        self.releaseBuildSettings = jsonObjs[buildConfigurationIds[1]
                                             ]["buildSettings"]

        for phaseUid in jsonObj['buildPhases']:
            phaseObj = jsonObjs[phaseUid]
            if phaseObj['isa'] == 'PBXSourcesBuildPhase':
                self.sourceUid = phaseUid
                for fileUid in phaseObj['files']:
                    self.sourceFiles.append(fileUid)
            elif phaseObj['isa'] == 'PBXResourcesBuildPhase':
                self.resourceUid = phaseUid
                for fileUid in phaseObj['files']:
                    self.resourceFiles.append(fileUid)
            elif phaseObj['isa'] == 'PBXFrameworksBuildPhase':
                self.frameworkUid = phaseUid
                for fileUid in phaseObj['files']:
                    self.frameworks.append(fileUid)
            elif phaseObj['isa'] == 'PBXCopyFilesBuildPhase' and phaseObj["name"] == "Embed Frameworks":
                self.embedFrameworkUid = phaseUid

    def buildIdForRefId(self, refId):
        for fileId in self.resourceFiles:
            fileObj = self.jsonObjs[fileId]
            if fileObj.get('fileRef', '') == refId:
                return fileId

        for fileId in self.sourceFiles:
            fileObj = self.jsonObjs[fileId]
            if fileObj.get('fileRef', '') == refId:
                return fileId

        for fileId in self.frameworks:
            fileObj = self.jsonObjs[fileId]
            if fileObj.get('fileRef', '') == refId:
                return fileId

        return None
