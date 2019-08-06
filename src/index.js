module.exports = function InfRecursive(f, args) {
    
    let q = [];

    let lastGetValue;
    function get(get_f, get_args, callback) {
        lastGetValue = [get_f,get_args,callback];
    }

    q.push([f,args]);

    //부정 (마지막 큐, 더이상의 요청하는 값이 없다) 동안 반복
    while(true) {
        //console.log(Object.assign({},q));
        let lastReturnValue;
        lastGetValue = undefined;

        let now = q[q.length-1];
        if(!now[3]) {
            lastReturnValue = now[0](get,now[1]);
        } else {
            lastReturnValue = now[0](now[4]);
        }
        
        if(lastGetValue) {       //다른 참조가 있을때
            q.push(lastGetValue);
        } else {               //다른 참조가 없을때 (순수 함수값)
            if(q.length === 1) { //큐에 더이상 항목이 없을 때(마지막 함수 일 때)
                return lastReturnValue;
            } else { //아직 있을때
                q.pop();   //주의! 여기서부터 now는 없어진 항목이다.
                let lastQ = q[q.length-1];
                lastQ[0] = now[2];
                lastQ[3] = true;
                lastQ[4] = lastReturnValue;
            }
        }
    }
};