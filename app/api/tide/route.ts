import { NextResponse } from "next/server";
export async function  GET(req:Request){
    const {searchParams} = new URL(req.url)
    const pc = searchParams.get('pc')
    const hc = searchParams.get('hc')
    const yr = searchParams.get('yr')
    const mn = searchParams.get('mn')
    const dy = searchParams.get('dy')

    const apiUrl = `https://api.tide736.net/get_tide.php?pc=${pc}&hc=${hc}&yr=${yr}&mn=${mn}&dy=${dy}&rg=day`
    const res = await fetch(apiUrl) 
    const data = await res.json()
    return NextResponse.json(data)

}