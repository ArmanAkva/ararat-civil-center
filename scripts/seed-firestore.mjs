import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKVJvw7-IbfRU0oGGTQqjuj88s7ZBJa0k",
  authDomain: "ararat-civil-center.firebaseapp.com",
  projectId: "ararat-civil-center",
  storageBucket: "ararat-civil-center.firebasestorage.app",
  messagingSenderId: "306816522579",
  appId: "1:306816522579:web:6c15e1bd42a42cd59ca9a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedUsers = [
  {
    uid: "super_admin_arman",
    email: "akvadevlead@gmail.com",
    displayName: "Arman Hovhannisyan",
    role: "super-admin",
    civilizationAffiliation: "Հայկական քաղաքակրթություն",
    affiliationTitle: "Գերադմին / Ֆորումի Հիմնադիր",
    bio: "Արարատյան Քաղաքակրթական Կենտրոնի տեխնիկական և հայեցակարգային ղեկավար:",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "admin_ararat_center",
    email: "admin@ararat-forum.org",
    displayName: "Արարատյան Կոորդինատոր",
    role: "admin",
    civilizationAffiliation: "Հայկական քաղաքակրթություն",
    affiliationTitle: "Գործադիր Ադմինիստրատոր",
    bio: "Քաղաքակրթական երկխոսությունների և 2027թ. Ֆորումի համակարգող:",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "scholar_zhao",
    email: "zhao.tingyang@cass.cn",
    displayName: "Ժաո Տինյան (Zhao Tingyang)",
    role: "scholar",
    civilizationAffiliation: "Չինական քաղաքակրթություն",
    affiliationTitle: "Առաջատար Փիլիսոփա, CASS",
    bio: "«Տյանսյա» համակարգի գլխավոր տեսաբան և քաղաքակրթական օնտոլոգիայի հետազոտող:",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "scholar_vartan",
    email: "vartan.gregorian@carnegie.org",
    displayName: "Վարդան Գրիգորյան (Vartan Gregorian)",
    role: "scholar",
    civilizationAffiliation: "Հայկական քաղաքակրթություն",
    affiliationTitle: "Պատմաբան, Փիլիսոփա",
    bio: "Համաշխարհային հումանիտար մտքի ներկայացուցիչ, մշակութային երկխոսությունների տեսաբան:",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "scholar_alain",
    email: "alain.benoist@nouvelledroite.fr",
    displayName: "Ալեն դը Բենուա (Alain de Benoist)",
    role: "scholar",
    civilizationAffiliation: "Եվրոպական քաղաքակրթություն",
    affiliationTitle: "Փիլիսոփա, Էսսեիստ",
    bio: "Ավանդական Եվրոպայի մշակութային ինքնության և բազմաբևեռ աշխարհակարգի պաշտպան:",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "member_sample_1",
    email: "researcher.eva@gmail.com",
    displayName: "Եվա Սարգսյան",
    role: "member",
    civilizationAffiliation: "Հունական քաղաքակրթություն",
    affiliationTitle: "Երիտասարդ Հետազոտող",
    bio: "Բյուզանդական ժառանգության և անտիկ փիլիսոփայության ասպիրանտ ԵՊՀ-ում:",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function runSeed() {
  console.log("Seeding Firestore 'users' collection...");
  for (const user of seedUsers) {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, user, { merge: true });
    console.log(`✓ Seeded user: ${user.displayName} (${user.role})`);
  }
  console.log("Done! All users have been successfully seeded to Firestore.");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
