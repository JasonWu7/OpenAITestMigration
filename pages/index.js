import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { useForm } from 'react-hook-form'
import 'bootstrap/dist/css/bootstrap.min.css'



export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const [result, setResult] = useState();
  const { handleSubmit, formState } = useForm()
  const { isSubmitting } = formState

  async function onSubmit(form, event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeInput, dest: destInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setCodeInput("");
      setDestInput("")
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Test Mig</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>

        <h3>OpenAI Test Migration</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            type="code"
            name="animal"
            placeholder="Enter the test to be converted or description"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input
            type="text"
            name="dest"
            placeholder="Enter the target platform to be convert"
            value={destInput}
            onChange={(e) => setDestInput(e.target.value)}
          />
          <div className="d-flex justify-content-center">
            {isSubmitting && (
              <span className="spinner-border text-info text-center"></span>
            )}
          </div>

          <button disabled={isSubmitting} type="submit" value="Convert" className="btn btn-success">
            Convert
          </button>
        </form>
        <textarea className={styles.result} value={result}></textarea>
        <button onClick={function () {
          navigator.clipboard.writeText(result);
          alert("The Response is copied to clipboard.");
        }}>Copy Response</button>
      </main>
    </div>
  );
}
