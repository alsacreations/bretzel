// On récupère le form
var form = document.querySelector('#layouts')
// On reset le form pour que ce soit toujours l'input 1 cochée par défaut
form.reset()
// On écoute les changements du formulaire
form.addEventListener('change', (e) => {
  // récupère la value de l'input pour changer l'url du codePen
  switchPenId(e.target.value)
})

function switchPenId(penId) {
  // On récupère l'iframe via sa classe
  const pen = document.querySelector('.cp_embed_iframe')
  if(pen) {
    // On récupère le src de l'iframe sous forme d'url pour gérer ses paramètres
    let url = new URL(pen.src)
    // On récupère l'ancien id de pen, celui qui se trouve après le dernier slash de pathname
    const oldPenid = url.pathname.slice(url.pathname.lastIndexOf('/') + 1)
    // Si j'ai bien reçu un id de codePen et qu'il est différent de l'ancien
    if (penId && penId !== oldPenid) {
      // Je coupe le pathname actuel après le dernier slash (pour virer l'ancien id) et je concatène avec le nouvel id
      url.pathname = url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1) + penId
      pen.src = url // appliqué c'est pesé
    }
  }
}
