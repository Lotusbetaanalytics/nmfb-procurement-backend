
exports.rand=()=>Math.random(0).toString(36).substr(2);
exports.token=(length)=>(this.rand()+this.rand()+this.rand()+this.rand()).substr(0,length);
