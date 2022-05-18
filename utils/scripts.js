
exports.rand=()=>Math.random(0).toString(36).substr(2);
exports.token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);
