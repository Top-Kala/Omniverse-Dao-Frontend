export default function regExpFormat(number:string|number){
    return ('' + number).replace(/(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d\d\d?)\d*$/g, 
    function(m, s1, s2){
      return s2 || (s1 + ',')
    }
  )
}