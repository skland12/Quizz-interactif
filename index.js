function exempleVar() {
var x = 10; //Déclaration
if (true) {
    let x = 20 //Réécriture de la même variable
    console.log(x) ; //Affiche : 20
}
console.log(x) ; // Affiche : 20 (pas de portée bloc)
}
exempleVar(); 