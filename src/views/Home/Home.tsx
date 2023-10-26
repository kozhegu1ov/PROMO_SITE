import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import qrCodeImg from "../../assets/images/qr-code.png";
import styles from "./Home.module.scss";
import { PROMO_PATH } from "../../router/paths";

const Home: FC = () => {
  const [isDisplayAside, setIsDisplayAside] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleProgress = (state: any) => {
    if (state.playedSeconds > 4.9) {
      setIsDisplayAside(true);
    }
  };

  return (
    <main className={`${styles.main} container`}>
      <ReactPlayer
        className={styles.video}
        url={
          "https://www.shutterstock.com/shutterstock/videos/1063112953/preview/stock-footage-animated-countdown-from-numbers-to-in-neon-s-style-on-a-blue-and-purple-background.webm"
        }
        controls={false}
        playing={true}
        loop={true}
        onProgress={handleProgress}
        muted={true}
      />
      {isDisplayAside && (
        <aside className={styles.aside}>
          <p className={styles.aside_title}>
            ИСПОЛНИТЕ МЕЧТУ ВАШЕГО МАЛЫША!
            <br /> ПОДАРИТЕ ЕМУ СОБАКУ!
          </p>
          <img src={qrCodeImg} alt="qrCodeImg" />
          <p className={styles.aside_text}>
            Сканируйте QR-код <br /> или нажмите ОК
          </p>
          <button className={styles.aside_btn} onClick={() => navigate(PROMO_PATH)}>ОК</button>
        </aside>
      )}
    </main>
  );
};

export default Home;
