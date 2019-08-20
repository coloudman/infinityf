let infinityf = {};


function generatorInfinityf(f, args) {
    
    let lastGetValue;
    function get(get_f, get_args) {
        lastGetValue = [get_f,get_args];
    }


    let q = [[f(get, args)]];


    while(true) {
        let lastReturnValue;
        lastGetValue = undefined;

        let now = q[q.length-1];
        lastReturnValue = now[0].next(now[1]).value;
        
        if(lastGetValue) {       //다른 참조가 있을때
            q.push([lastGetValue[0](get,lastGetValue[1])]);
        } else {               //다른 참조가 없을때 (순수 함수값)
            if(q.length === 1) { //큐에 더이상 항목이 없을 때(마지막 함수 일 때)
                return lastReturnValue;
            } else { //아직 있을때
                now[0].return();
                q.pop();   //주의! 여기서부터 now는 없어진 항목이다.

                //콜백으로 개조한다, callback도 당연히 또 run을 할 수 있으므로 비슷하게 만든다.
                let lastQ = q[q.length-1];
                lastQ[1] = lastReturnValue;
            }
        }
    }
}


//[function,arg,callback] //일반, 요청시
//[callback_function,result,callback,isCallback] //요청이 끝나고 그 전 함수로 콜백을 돌릴때 (완료된 요청이 이렇게 바뀜)

function callbackInfinityf(f, args) {
    
    let q = [];

    let lastGetValue;
    function get(get_f, get_args, callback) {
        lastGetValue = [get_f,get_args,callback];
    }

    q.push([f,args]);

    while(true) {
        let lastReturnValue;
        lastGetValue = undefined;

        let now = q[q.length-1];
        if(!now[3]) {
            lastReturnValue = now[0](get,now[1]);
        } else {
            lastReturnValue = now[0](now[1]);
        }
        
        if(lastGetValue) {       //다른 참조가 있을때
            q.push(lastGetValue);
        } else {               //다른 참조가 없을때 (순수 함수값)
            if(q.length === 1) { //큐에 더이상 항목이 없을 때(마지막 함수 일 때)
                return lastReturnValue;
            } else { //아직 있을때
                q.pop();   //주의! 여기서부터 now는 없어진 항목이다.

                //콜백으로 개조한다, callback도 당연히 또 run을 할 수 있으므로 비슷하게 만든다.
                let lastQ = q[q.length-1];
                lastQ[0] = now[2];
                lastQ[1] = lastReturnValue;
                lastQ[3] = true;
            }
        }
    }
}


//[function,arg,callback] //일반, 요청시
//[function,arg,callback,result] //일반, 요청 처리시
//[callback_function,solveData,,,issolve] //요청이 끝나고 그 전 함수로 콜백을 돌릴때 (완료된 요청이 이렇게 바뀜)

async function asyncInfinityf(f, args) {
    
    let q = [];

    let lastGetValue;
    let lastGetSolve;
    function get(get_f, get_args) {
        let callback;
        let prom = new Promise(solve=>{
            callback = solve;
        });
        lastGetValue = [get_f,get_args,callback];
        lastGetSolve();

        return prom;
    }

    q.push([f,args]);

    while(true) {
        //console.log(Object.assign({},q));
        let lastReturnValue;
        lastGetValue = undefined;

        let now = q[q.length-1];

        let lastGetPromise = new Promise(solve=>{
            lastGetSolve = solve;
        });
        if(!now[4]) {
            lastReturnValue = await Promise.race([
                now[3] = now[0](get,now[1]),
                lastGetPromise
            ]);
        } else {
            now[0](now[1]); //await를 풀음
            q.pop(); //await용 임시명령 없앰

            //이제 원래로 돌아와서..
            now = q[q.length-1];
            lastReturnValue = await Promise.race([
                now[3],
                lastGetPromise
            ]);

        }
        
        if(lastGetValue) {       //다른 참조가 있을때
            q.push(lastGetValue);
        } else {               //다른 참조가 없을때 (순수 함수값)
            if(q.length === 1) { //큐에 더이상 항목이 없을 때(마지막 함수 일 때)
                return lastReturnValue;
            } else { //아직 있을때

                q.pop();   //주의! 여기서부터 now는 없어진 항목이다.
                q.push([now[2],lastReturnValue,,,true]);

            }
        }
    }
}



infinityf.generator = generatorInfinityf;
infinityf.callback = callbackInfinityf;
infinityf.async = asyncInfinityf;

module.exports = infinityf;