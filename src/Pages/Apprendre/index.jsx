import React from 'react';
import './apprendre.scss';

const Apprendre = () => {
  return (
    <div className="apprendre-page">
      <div className="apprendre-header glass-panel">
        <h1>Apprendre la Prière</h1>
        <p className="text-secondary">Guide pas à pas pour accomplir la Salat et apprendre le Tashahhud</p>
      </div>

      <div className="apprendre-content">
        <section className="guide-section glass-panel">
          <h2>1. Introduction à la Prière</h2>
          <p>
            La prière (Salat) est le deuxième pilier de l'Islam. Elle est obligatoire pour tout musulman à l'âge de la puberté. Avant de commencer, il faut s'assurer d'être en état de pureté (ablutions - Woudou), d'être tourné vers la Qibla (La Mecque) et d'avoir l'intention (Niyya) de prier.
          </p>
        </section>

        <section className="guide-section glass-panel">
          <h2>2. Les étapes de la Prière (Rak'at)</h2>
          <div className="step-card">
            <div className="step-card__content">
              <h3>A. Takbirat al-Ihram</h3>
              <p>Levez les mains au niveau des oreilles et dites : <br /><strong className="arabic-trans">« Allahou Akbar »</strong> (Dieu est le plus grand).</p>
            </div>
            <img src="/img/prayer/takbir.png" alt="Takbir" className="step-card__img" />
          </div>
          <div className="step-card">
            <h3>B. Récitation (Al-Fatiha)</h3>
            <p>Debout, récitez la sourate Al-Fatiha, suivie d'une autre sourate ou quelques versets (lors des deux premières unités de prière).</p>
          </div>
          <div className="step-card">
            <div className="step-card__content">
              <h3>C. L'Inclinaison (Roukou)</h3>
              <p>Inclinez-vous, le dos droit, en disant : <br /><strong className="arabic-trans">« Soubhana Rabbiyal Adhim »</strong> (3 fois) (Gloire à mon Seigneur l'Immense).</p>
            </div>
            <img src="/img/prayer/ruku.png" alt="Ruku" className="step-card__img" />
          </div>
          <div className="step-card">
            <h3>D. Se Redresser</h3>
            <p>En vous redressant, dites : <br /><strong className="arabic-trans">« Sami'a Allahou liman hamidah »</strong> (Dieu entend celui qui Le loue), puis <strong className="arabic-trans">« Rabbana wa lakal hamd »</strong> (Seigneur, à Toi la louange).</p>
          </div>
          <div className="step-card">
            <div className="step-card__content">
              <h3>E. La Prosternation (Soujoud)</h3>
              <p>Prosternez-vous, le front et le nez au sol, en disant : <br /><strong className="arabic-trans">« Soubhana Rabbiyal A'la »</strong> (3 fois) (Gloire à mon Seigneur le Très-Haut).</p>
            </div>
            <img src="/img/prayer/sujud.png" alt="Sujud" className="step-card__img" />
          </div>
        </section>

        <section className="guide-section glass-panel">
          <h2>3. Le Tashahhud</h2>
          <p>Le Tashahhud se récite en position assise (après chaque 2ème Rak'at et à la fin de la prière).</p>
          
          <div className="tashahhud-card">
            <h3 className="text-accent">Première partie (Les Salutations)</h3>
            <div className="tashahhud-card__layout">
              <div className="tashahhud-card__text">
                <p className="arabic">التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</p>
                <p className="transliteration">"At-tahiyyâtou lillâhi, wa s-salawâtou wa t-tayyibâtou. As-salâmou 'alayka ayyouha n-nabiyyou wa rahmatou llâhi wa barakâtouhou. As-salâmou 'alaynâ wa 'alâ 'ibâdi llâhi s-sâlihîn. Ach-hadou an lâ ilâha illa llâhou wa ach-hadou anna Mouhammadan 'abdouhou wa rasoûlouh."</p>
                <p className="translation">"Les salutations sont pour Allah, ainsi que les prières et les bonnes œuvres. Que la paix soit sur toi, ô Prophète, ainsi que la miséricorde d'Allah et Ses bénédictions. Que la paix soit sur nous et sur les serviteurs vertueux d'Allah. J'atteste qu'il n'y a de divinité digne d'adoration qu'Allah et j'atteste que Muhammad est Son serviteur et Son messager."</p>
              </div>
              <img src="/img/prayer/tashahhud.png" alt="Tashahhud Position" className="tashahhud-img" />
            </div>
          </div>

          <div className="tashahhud-card">
            <h3 className="text-accent">Deuxième partie (La Prière sur le Prophète) - Fin de Salat</h3>
            <p className="arabic">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ</p>
            <p className="transliteration">"Allâhoumma salli 'alâ Mouhammadin wa 'alâ âli Mouhammadin, kamâ sallayta 'alâ Ibrâhîma wa 'alâ âli Ibrâhîma, innaka Hamîdoun Majîd. Allâhoumma bârik 'alâ Mouhammadin wa 'alâ âli Mouhammadin, kamâ bârakta 'alâ Ibrâhîma wa 'alâ âli Ibrâhîma, innaka Hamîdoun Majîd."</p>
            <p className="translation">"Ô Allah, prie sur Muhammad et sur la famille de Muhammad comme Tu as prié sur Ibrahim et sur la famille d'Ibrahim, Tu es certes Digne de louange et de gloire. Ô Allah, bénis Muhammad et la famille de Muhammad comme Tu as béni Ibrahim et la famille d'Ibrahim, Tu es certes Digne de louange et de gloire."</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Apprendre;
