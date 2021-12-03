import app from "./index.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

const db = getFirestore(app);

const revForm = document.getElementById("review-form");
const revCard = document.getElementById("review-card");
const revLoc = document.getElementById("review-place");
const revDesc = document.getElementById("review-description");
const custXP = document.getElementById("customer-experience");
const sueloS = document.getElementById("cuidado-suelos");
const vidaSil = document.getElementById("cuidado-silvestre");
const enerUse = document.getElementById("energias");
const noiseS = document.getElementById("cuidado-ruido");
const apoyoGen = document.getElementById("apoyo-locales");
const btnRevForm = document.getElementById("btn-review-form");

let editStatus = false;
let id = "";

const saveReview = (
  place,
  description,
  experience,
  ground,
  life,
  energy,
  noise,
  people
) =>
  addDoc(collection(db, "reviews"), {
    place,
    description,
    experience,
    ground,
    life,
    energy,
    noise,
    people
  });

const getReviews = () => getDocs(collection(db, "reviews"));

const getReview = (id) => getDoc(doc(db, "reviews", id));

const onGetReviews = (callback) =>
  onSnapshot(collection(db, "reviews"), callback);

const deleteReview = (id) => deleteDoc(doc(db, "reviews", id));

const updateReview = (id, updatedReviews) =>
  updateDoc(doc(db, "reviews", id), updatedReviews);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetReviews((querySnapshot) => {
    revCard.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data());

      const review = doc.data();
      review.id = doc.id;
      console.log("descripcion: " + review.description);
      revCard.innerHTML += `<div class="card card-body mt-2 
              border-primary">
              <h3 class="h5"> ${review.place}</h3>
              <p> ${review.description}</br>
              Experiencia en general: ${review.experience}/5</br>
              Cuidado de los suelos: ${review.ground}/5</br>
              Cuidado de la vida silvestre: ${review.life}/5</br>
              Uso responsable de energía: ${review.energy}/5</br>
              Cuidado del ruido: ${review.noise}/5 </br>
              Apoyo a locales: ${review.people}/5</br>
              </p>
              <div>
                  <button class="btn btn-danger btn-delete" data-id="${review.id}"> Eliminar </buttton> 
                  <button class="btn btn-primary btn-edit" data-id="${review.id}"> Editar </buttton>
              </div>
              </div>`;
      //DELETE SECTION

      const btnsDelete = document.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          await deleteReview(e.target.dataset.id);
        });
      });

      //UPDATE SECTION
      const btnsEdit = document.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const doc = await getReview(e.target.dataset.id);
          const review = doc.data();
          console.log("editing");

          editStatus = true;
          id = doc.id;

          revLoc.value = review.place;
          revDesc.value = review.description;
          custXP.value = review.experience;
          sueloS.value = review.ground;
          vidaSil.value = review.life;
          enerUse.value = review.energy;
          noiseS.value = review.noise;
          apoyoGen.value = review.people;
          btnRevForm.innerText = "Actualizar";
        });
      });
    });
  });
});

revForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const place = revLoc;
  const description = revDesc;
  const experience = custXP;
  const ground = sueloS;
  const life = vidaSil;
  const energy = enerUse;
  const noise = noiseS;
  const people = apoyoGen;

  if (!editStatus) {
    await saveReview(
      place.value,
      description.value,
      experience.value,
      ground.value,
      life.value,
      energy.value,
      noise.value,
      people.value
    );
  } else {
    await updateReview(id, {
      place: place.value,
      description: description.value,
      experience: experience.value,
      ground: ground.value,
      life: life.value,
      energy: energy.value,
      noise: noise.value,
      people: people.value
    });

    editStatus = false;
    id = "";
    btnRevForm.innerText = "Publicar";
  }

  await getReviews(); //aki

  revForm.reset();
});

// Initialize Firebase Authentication
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    alert("User is signed in");
    // ...
  } else {
    alert("User is NOT signed in");
  }
});
