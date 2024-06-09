
const fileTypesList: {
    [key: string]: {
        id: number,
        data: Array<string>
    }
}  = {
    images: {
        id: 1,
        data: ['ai', 'bmp', 'icns', 'ico', 'jpeg', 'jpg', 'pct', 'pict', 'pna', 'png', 'psd', 'tif', 'tiff', 'svg']
    },
    documents: {
        id: 2,
        data: ['txt', 'log', 'csv', 'djvu', 'ods', 'odt', 'pages', 'ps', 'rtf', 'wpd', 'wps', 'xar', 'xps']
    },
    archives: {
        id: 3,
        data: ['7z', 'ace', 'arj', 'cab', 'gz', 'gzip', 'jar', 'pak', 'rar', 'tar', 'tar-gz', 'tgz', 'zip', 'zipx']
    },
    msword: {
        id: 4,
        data: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx']
    },
    msexcel: {
        id: 5,
        data: ['xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx']
    },
    mspowerpoint: {
        id: 7,
        data: ['pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx']
    },
    pdf: {
        id: 6,
        data: ['pdf']
    }
}

const getFileType = (type: string): string | null=> {
    for (const key in fileTypesList) {
        const fileType = fileTypesList[key].data.find((item: string) => item === type)

       if(fileType) return `${fileTypesList[key].id}`
    }

    return null
}

export { getFileType };
