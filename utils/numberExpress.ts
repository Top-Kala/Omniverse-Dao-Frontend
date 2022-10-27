export function numberExpression(str:string){
    let num = parseFloat(str)
    if(num < 1000){
        return num
    }else{
        const CK1 = ~~num / 1000
        return(CK1+'K')
    }
}