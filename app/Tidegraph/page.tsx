import React from "react";
import {useState,useEffect} from "react";
export default function Tidegraph(){
    const [pref,setPref] = useState("")//県を設定
    const [port,setPort] = useState("")//港を設定
    const [year,setYear] = useState(2025)//以下で年月日を設定
    const [month,setMonth] = useState(1)
    const [day,setDay] = useState(1)
    const [data,setData] = useState<any>(null)//取得データを定義

    
    return(
        <>

        </>
    )
}