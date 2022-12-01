import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ingredientInput, setingredientInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    if (result) {
      document.querySelector(".showImg").style.display = "none";
    }
    setResult("Loading...");
    document.querySelector(".show").style.display = "none";
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredient: ingredientInput }),
    });
    const data = await response.json();
    setResult(data.result);
    document.querySelector(".show").style.display = "block";
  }

  function getInstructions() {
    if (result) {
      const resultSplit = result.split(/\r?\n/);
      return resultSplit.map((item, index) => {
        if (index == resultSplit.indexOf("Instructions:")) {
          return <strong key={index} >{item}</strong>;
        }
        else if (index > resultSplit.indexOf('Instructions:')) { // index > 1 is the instructions
          return <p key={index}>{item}</p>;
        }
      });
    }
  }

  function getIngredients() {
    if (result) {
      const resultSplit = result.split(/\r?\n/);
      return resultSplit.map((item, index) => {
        if (index == 0 && index !== resultSplit.indexOf("Ingredients:")) {
          return
        } else if (index < resultSplit.indexOf("Ingredients:")) { // Title recipe
          return <h2 key={index}>{item}</h2>;
        } else if (index == resultSplit.indexOf("Ingredients:")) {
          return <strong key={index}>{item}</strong>;
        }
        else if (index > resultSplit.indexOf('Ingredients:') && index < resultSplit.indexOf('Instructions:')) { // index > 1 is the instructions
          return <p key={index}>{item}</p>;
        }
      });
    }
  }

  function showImg() {
    if (result) {
      const resultSplit = result.split(/\r?\n/);
      return resultSplit.map((item, index) => {
        if (index == 0) {
          return <img key={index} src={item} className="showImg" style={{ display: "none" }} />;
        }
      });
    }
  }

  function displayImg() {
    if (result) {
      if (document.querySelector(".showImg").style.display == "none") {
        document.querySelector(".showImg").style.display = "block";       
      } else {
        document.querySelector(".showImg").style.display = "none";
      }
    }
  }


  function launchCamera() {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("Let's get this party started")
      // navigator.mediaDevices.getUserMedia({video: true})
    }
  }  

  return (
    <div>
      <Head>
        <title>Burning Kitchen</title>
        <link rel="icon" href="/cook.png" />
      </Head>

      <main className={styles.main}>

        <h3>Burning Kitchen</h3>
        <div className="container" style={{ display: 'flex' }}>
          <div className={styles.title}>
            <img src="/cook.png" className={styles.icon} />
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="food"
                placeholder="Choose an ingredient"
                value={ingredientInput}
                onChange={(e) => setingredientInput(e.target.value)}
              />
              <input type="submit" value="Your recipe" />
            </form>
            <div className={styles.result1}>{getIngredients()}</div>
          </div>
          <div className={styles.result2}>
            {getInstructions()}
            <button className="show" onClick={displayImg} style={{ display: "none" }}>what does it look like</button>
            <div>{showImg()}</div>
          </div>

        </div>
      </main>
      <style jsx>{`
        .showImg {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
