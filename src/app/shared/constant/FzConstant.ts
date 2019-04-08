import { Mmt1i020Service } from "src/app/_services/mmt1i020.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FzConstant {
    SUP_STS_FLAG_1: string = "1";
    SUP_STS_FLAG_2: string = "2";
    SUP_STS_FLAG_MAP: Map<string, string>;

    IS_FZ_FLAG_0: string = "0";
    IS_FZ_FLAG_1: string = "1";
    IZ_SZ_FLAG_MAP: Map<string, string>;
    
    WEIGHT_FLAG_0: string = "0";
    WEIGHT_FLAG_1: string = "1";
    WEIGHT_FLAG_MAP: Map<string, string>;
    
    constructor(private mmt1i020Service: Mmt1i020Service) {
        this.SUP_STS_FLAG_MAP = new Map();
        this.SUP_STS_FLAG_MAP.set(this.SUP_STS_FLAG_1, "Active");
        this.SUP_STS_FLAG_MAP.set(this.SUP_STS_FLAG_2 , "N/A");

        this.IZ_SZ_FLAG_MAP = new Map();
        this.IZ_SZ_FLAG_MAP.set(this.IS_FZ_FLAG_0, "ไม่ใช้สิทธิ");
        this.IZ_SZ_FLAG_MAP.set(this.IS_FZ_FLAG_1 , "ใช้สิทธิ");

        this.WEIGHT_FLAG_MAP = new Map();
        this.WEIGHT_FLAG_MAP.set(this.WEIGHT_FLAG_0, "ไม่ใช่");
        this.WEIGHT_FLAG_MAP.set(this.WEIGHT_FLAG_1 , "ใช่");



        // this.mmt1i020Service.getMSupuseList().subscribe(res => 
        //     res.forEach(obj => {
        //         this.SUP_USE_FLAG_MAP.set(obj.supuseFlag , obj);
        //     })
        // );
    }
}