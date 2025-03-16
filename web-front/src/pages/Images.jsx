import {useEffect,useState} from 'react'
import { api, mediaApi, API_BASE_URL } from '../config/api'
import AlertPop from "../AlertPop"

const Images = () => {
    const [images,setImages]= useState([])
    const [msg,setMsg]=useState("")
    const [type,setType]=useState("success")
    const [alertVisible, setAlertVisible] = useState(false);
    const showAlertFunction = (msg,type) => {
      setAlertVisible(true);
      setType(type)
      setMsg(msg)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    };

    const getImages=async()=>{
        try{
            const response=await api.get("/media/files")
            setImages(await response.data?.data)
        }catch(error){
            showAlertFunction(error?.response?.data?.message,'warning')
        }
    }
     useEffect(()=>{
            getImages()
     },[])
  return (
    <div>
         {alertVisible && <AlertPop message={msg} type={type}/>}


         <div className="flex flex-wrap justify-center gap-3 mt-3">
         
        {images?.map((ima, index) => (
          <div key={index} className="flex flex-row gap-2 mx-2 bg-blue-200 p-2 rounded-lg">
            <img
              src={API_BASE_URL+"/media/img/"+ima?.filename+"?token="+localStorage.getItem("jwt")}
              alt={ima?.filename}
              className=" w-[100px] h-[100px] object-cover rounded-md"
            />
            <div>
                <div><span className='font-bold'>isProcessed: </span> {String(ima?.metadata?.isProcessed)}</div>
                <div><span className='font-bold'>Type: </span> {ima?.metadata?.type}</div>
                <div><span className='font-bold'>Filename:</span> {ima?.filename}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Images