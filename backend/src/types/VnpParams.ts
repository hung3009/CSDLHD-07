interface VnpParams {
    vnp_Version: string;
    vnp_Command: string;
    vnp_TmnCode: string;
    vnp_Amount: number;
    vnp_CurrCode: string;
    vnp_TxnRef: string;
    vnp_OrderInfo: string;
    vnp_OrderType: string;
    vnp_Locale: string;
    vnp_ReturnUrl: string;
    vnp_IpAddr: string | string[] | undefined;
    vnp_CreateDate: string;
    vnp_BankCode?: string;
    vnp_SecureHash?: string ;
    vnp_ExpireDate?:string;
  }



  export {VnpParams}