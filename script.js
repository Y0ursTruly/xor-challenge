//I do not normally code in an object oriented style (I DETEST IT)
//however this may be educational to you who's looking ;--;
//also educational to myself cuz yeah I don't do this often
class Bit{
  #element;
  constructor(b){
    this.#element=document.createElement('div');
    this.bit=b;
  }
  get element(){return this.#element}
  get bit(){return Number(this.#element.innerHTML)}
  set bit(b){
    this.#element.classList.remove("one","zero");
    this.#element.classList.add("bit",Number(b)?"one":"zero");
    this.#element.innerHTML=Number(b);
  }
  static byte(c,string){
    let bits=String(c).charCodeAt(0).toString(2);
    while(bits.length<8) bits='0'+bits;
    if(string) return bits;
    return bits.split('').map(b=>new Bit(b));
  }
}
class Char{
  #p;
  #bits;
  #element;
  #wrapper;
  #correctChar;
  constructor(c,correctChar,noChange){
    if(correctChar && typeof correctChar!=="function")
      throw new TypeError("correctChar argument, when used MUST be a function");
    this.#correctChar=correctChar;
    this.#wrapper=document.createElement('section');
    this.#element=document.createElement('div');
    this.#p=document.createElement('p');
    this.#element.classList.add("char");
    this.#bits=Bit.byte(c);
    this.char=c; //updates the character based on the character assigned
    this.#wrapper.append(this.#element, document.createElement('br'));
    this.#element.append(this.#p);
    for(let i=0;i<this.#bits.length;i++){
      const bit=this.#bits[i], char=this;
      this.#wrapper.appendChild(bit.element);
      if(noChange) continue;
      bit.element.addEventListener('click',function(){ //bit.element uses the get element function
        bit.bit = !bit.bit; //assigning(LHS) uses the set bit function, accessing(RHS) uses the get bit function
        char.char = char.char; //the same idea as the line above with set char and get char
      })
    }
  }
  get p(){return this.#p}
  get wrapper(){return this.#wrapper}
  get element(){return this.#element}
  get char(){return String.fromCharCode( Number.parseInt(this.#bits.map(b=>b.bit).join(''),2) )}
  set char(c){
    if(this.#correctChar){
      this.#element.classList.remove("correct","wrong");
      this.#element.classList.add(this.#correctChar(c)?"correct":"wrong");
    }
    let bits=Bit.byte(c,true);
    for(let i=0;i<bits.length;i++) this.#bits[i].bit=bits[i];
    this.#p.innerHTML=c;
  }
}

const answer="WINS", text="TEXT".split('').map(c=>new Char(c,null,true));
const result=answer.split('').map(function(c,i){
  return new Char(String.fromCharCode(text[i].char.charCodeAt()^c.charCodeAt()),null,true);
});
const pass="PASS".split('').map((c,i)=>new Char(c,function(char){
  const xor=text[i].char.charCodeAt()^char.charCodeAt();
  result[i].char=String.fromCharCode(xor);
  return xor === answer.charCodeAt(i);
}));

text.forEach(char=>document.body.appendChild(char.wrapper));
document.body.append(document.createElement('br'), document.createElement('br'));
pass.forEach(char=>document.body.appendChild(char.wrapper));
document.body.append(document.createElement('br'), document.createElement('br'));
result.forEach(char=>document.body.appendChild(char.wrapper));
document.body.append(document.createElement('br'), document.createElement('br'));