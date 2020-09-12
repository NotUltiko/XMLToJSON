const fs = require(`fs`)

function parseXML(xmlData)
{
    const data = xmlData.toString();
    const sax = require(`sax`);

    const parser = sax.parser(true, { trim:true });
    parser.onerror = (e) => {
        console.log("XML error: ", e.toString());
        return{};
    };

    let ctag = null;
    let xmlroot = null;

    parser.ontext = (t) => {
        if (ctag && t.length > 0) {
            ctag["data"] = t;
        }
    }

    parser.onopentag = (node) => {
        const name = node.name;
        const parent = ctag;
        ctag = {};
        ctag.content = [];
        ctag.idFlag = false;
        if (xmlroot === null) {
            xmlroot = {};
            xmlroot[name] = ctag;
        } else {
            ctag.parent = parent;
            const xtag = {};
            xtag[name]= ctag;
            parent.content.push(xtag);
        }

        for(const k in node.attributes) {
            ctag[k] = node.attributes[k];
        }

        while(parent && !parent.idFlag)
        {
            for(let i=0; i < parent.content.length - 1; i++)
            {
                const elem = parent.content[i];
                for(const key in elem)
                {
                    if(key == name) parent.idFlag=true;
                    break;
                }
            }
            break;
        }
    };

    parser.onclosetag = function() {
        if(ctag.idFlag == false)
        {
            for(let i = 0; i < ctag.content.length; i++) {
                const xtag = ctag.content[i];
                for(let u in xtag) {
                    ctag[u]=xtag[u];
                }
            }
            delete ctag.content;
        }
        delete ctag.idFlag;
        if (ctag.parent) {
            const parent = ctag.parent;
            delete ctag.parent;
            ctag = parent;
        }
    }

    parser.write(data).end();
    return xmlroot;
}


/**
 * Run
 */

const fileList = fs.readdirSync('files-to-convert');
fileList.splice(fileList.indexOf('.gitkeep'), 1);

console.log(`${fileList.length} file${fileList.length > 1 ? 's' : ''} to convert : `)

fileList.forEach( fileToConvert => {

    if (fileToConvert.includes('.xml')){

        console.log(`Converting ${fileToConvert}`);

        const xmlData = fs.readFileSync(`files-to-convert/${fileToConvert}`).toString();
        const javascriptObjectData = parseXML(xmlData);

        fs.writeFile(`converted/${fileToConvert.split('.')[0]}.json`,
            JSON.stringify(javascriptObjectData, null, 4),
            (error) => {
            if (error) {
                throw error;
            }
            console.log(`${fileToConvert.split('.')[0]}.json created from ${fileToConvert}`)
        });

    } else {

        console.log(`Not converting ${fileToConvert}, doesn't have .xml extension`);

    }
});