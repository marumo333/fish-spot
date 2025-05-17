import type {NextApiRequest,NextApiResponse} from "next";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {lat,lon} = req.query;//latは緯度、lonは軽度
    const apiKey = process.env.WINDY_API_KEY!;
    const WindyRes = await fetch("https://api.windy.com/api/point-forecast/v2",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${apiKey}`,
        },
        body:JSON.stringify({
            lat:Number(lat),
            lon:Number(lon),
            model:"gfs",
            parameters:["wind_u","wind_v"],
            levels:["surface"],
        })
    });
    const data = await WindyRes.json();
    res.status(200).json(data);
}