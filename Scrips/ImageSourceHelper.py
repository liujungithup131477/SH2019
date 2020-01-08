#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys
import getopt
import os

ROOTPATH = os.path.abspath(
    "%s/../" % os.path.dirname(os.path.realpath(__file__)))
FILEPATH = os.path.abspath(
    "%s/src/Resources/Images" % ROOTPATH)


def start():
    handleDirPath(FILEPATH, ROOTPATH)


def printList(List):
    for str in List:
        print(str)


class ImageFile():
    # /user/bin/a@2x.jpg   path为 /user/bin/a@2x/jpg   fileName = a@2x.jpg name = a
    path = ''
    fileName = ''
    fileType = ''  # jpg.png.....
    complete = False
    lackTypes = []  # 缺少Type

    def __init__(self):
        self.name = 'defaultName'
        self.lackTypes = ['@1x', '@2x', "@3x"]


def sortImageFile(file1, file2):
    return file1.fileName < file2.fileName


def handleDirPath(dirPath, rootPath):

    errorFiles = []
    imperfectFiles = []
    for root, dirs, files in os.walk(dirPath):
        print('root', root)
        currentPath = root
        currentFiles = files
        imageFiles = []
        allPaths = []
        for file in currentFiles:
            if file.endswith(('.png', '.jpg', '.gif')):
                # 是正确的图片格式
                imageFiles.append(file)
                allPaths.append(file)
            else:
                # 非正常文件
                errorFiles.append(currentPath+file)

        if len(allPaths) > 0:
            fileInfos = []
            # 遍历所有路径
            for path in allPaths:
                # 图片种类
                image_type = '@1x'
                # 图片类型
                fileType = path.split('.')[-1]
                # 图片名
                name = path[: - len(fileType) - 1]

                lackTypes = ['@1x', '@2x', '@3x']
                for str in lackTypes:
                    if str in path:
                        # 获得图片种类 . @2x @3x
                        image_type = str
                        name = name[:-3]
                contains = False
                file = ImageFile()
                for obj in fileInfos:
                    if obj.name == name:
                        contains = True
                        file = obj
                if contains == True:
                    file.lackTypes.remove(image_type)
                    file.complete = len(file.lackTypes) == 0
                else:
                    file.path = currentPath+path
                    file.name = name
                    file.fileName = path
                    file.fileType = fileType
                    file.lackTypes.remove(image_type)
                    fileInfos.append(file)
            print('\n')
            print('//' + root.split('/')[-1])
        writeText = 'export default { \n'
        fileInfos = sorted(fileInfos, key=lambda fileInfo: fileInfo.name)
        # fileInfos.sort(reverse=True)
        for obj in fileInfos:
            if (obj.complete == True):
                item = "    "+obj.name+':'+" require('"+root.replace(rootPath+'/',
                                                                     '') + '/' + obj.name + '.' + obj.fileType + "'),\n"
                writeText += item
            else:
                imperfectFiles.append(obj)
        writeText += '}'
        imperfectText = '/*\nImperfectFiles\n'
        if len(imperfectFiles) != 0:
            for obj in imperfectFiles:
                item = obj.name + ':' + obj.lackTypes+'\n'
                imperfectText += item
            imperfectText += '*/'
            print(imperfectText)
        print(writeText)
        cfPath = os.path.abspath(
            "%s/src/Configs/ConfigFiles/imageConfigs.js" % ROOTPATH)
        with open(cfPath, 'w') as f:
            f.write(writeText)
    return []


if __name__ == '__main__':
    start()
