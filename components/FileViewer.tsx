interface Props {
    fileData : File[]
}

const FilePreview = ({fileData} : Props) => {
    const fileList = []
    for (const file of fileData){
        fileList.push(file)
    }
    // fileData.filelist.map(f=>console.log(f))
    // console.log(fileData.length)
    return (
      <div className="mb-2" >
        <div className="text-blue-400 text-xs italic">
        <ol className="list-disc">
          {fileList.map(f =>
                <li key={f.lastModified} >                
                <div key={f.name} >
                    {f.name}
                </div>
                </li>
          )
        }
        </ol>
            
        </div>
      </div>
    );
  };
  
  export default FilePreview;