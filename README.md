# XMLToJSON

Custom complex XML to JSON converter

## Run converter
```
    git clone https://github.com/NotUltiko/XMLToJSON.git
    npm install
    #Move your xml files into "files-to-convert" directory
    node index.js
    #JSON files will be created in "converted" directory
```


##Example
Will convert XML
```XML
<parentTag toto="yes" tata="ok">
    <childTag1>
        someDatas
    </childTag1>
</parentTag>
```

Into JSON
````json
{
  "parentTag": {
    "toto": "yes",
    "tata": "ok",
    "content": [
      {
      "childTag1": {
              "value": "someDatas"
        }  
      }
    ] 
  }
}
````