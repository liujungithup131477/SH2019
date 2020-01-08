
import sys
from fontTools.ttLib import TTFont
import os
import shutil
import json

# 获取字体文件postScriptName
FONT_POSTSCRIPT_NAME_ID = 6


def getFontPostScriptName(fontPath):
    if os.path.isfile(fontPath) == False:
        raise Exception('Font not exist:'+fontPath)
    fileType = os.path.splitext(fontPath)[-1]
    if fileType != '.ttf' and fileType != '.otf':
        raise Exception('Font file type is invaild :'+fontPath)
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
        raise Exception('Font postScriptName Not exist :'+fontPath)


def getFontName():
    fontPath = sys.argv[1]
    postScriptName = getFontPostScriptName(fontPath)
    print(postScriptName)
    return postScriptName


if __name__ == "__main__":
    getFontName()
