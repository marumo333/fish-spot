import React from "react";
import {useState,useEffect} from "react";
export default function Tidegraph(){
    const [pref,setPref] = useState("")//県を設定
    const [port,setPort] = useState("")//港を設定
    const [year,setYear] = useState(2025)//以下で年月日を設定
    const [month,setMonth] = useState(1)
    const [day,setDay] = useState(1)
    const [data,setData] = useState<any>(null)//取得データを定義
    const [pchc,setPchc] =useState<any>({})//港のデータ
    const [pcCodes,setPcCodes] = useState<any>({})//都道府県データ
    const [calender,setCalender] =useState({})//カレンダーデータ

    useEffect(()=>{
        Promise.all([
            fetch("./pc_hc.json").then(res=>res.json()),
            fetch("./pc_code.json").then(res=>res.json()),
            fetch("calender.json").then(res=>res.json())
        ]).then(([hc,code,cal])=>{
            setPchc(hc)
            setPcCodes(code)
            setCalender(cal)
        })
        .catch(err=>
            console.error("データの取得に失敗しました",err)
        )
    },[])
    const getTide=async()=>{
        const pc = pcCodes[pref]
        const hc = pchc[pref][port]
        const res = await fetch(`https://api.tide736.net/get_tide.php?&pc=${pc}&hc=${hc}&yr=${year}&mh=${month}&dy=${day}&rg=day`)
        const json = await res.json()
        setData(json)
    }
    return(
        <>
        <button onClick={getTide}>情報を取得</button>
        </>
    )
}