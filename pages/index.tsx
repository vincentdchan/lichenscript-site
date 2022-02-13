import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

function Card({ children, unactive }: { children: any, unactive?: boolean }) {
  let className;
  if (unactive) {
    className = styles.card + ' ' + styles.unactive;
  } else {
    className = styles.card;
  }
  return (
    <div
      className={className}
    >
      {children}
    </div>
  )

}

function GithubIcon() {
  return (
    <a className={styles.github} href="https://github.com/vincentdchan/LichenScript">
      <Image src="/GitHub-Mark-120px-plus.png" />
    </a>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <GithubIcon />
      <Head>
        <title>LichenScript</title>
        <meta name="description" content="A lightweight language compiled to JavaScript/C." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img
          src="/lichenscript.svg"
          style={{ marginBottom: '32px' }}
          alt=""
        />

        <h1 className={styles.title}>
          LichenScript
        </h1>

        <p className={styles.description}>
          A lightweight language compiled to JavaScript/C.
        </p>

        <div className={styles.grid}>
          <Card>
            <h2>Target C</h2>
            <ul className={styles.justifyList}>
              <li>Portable(WebAssembly/Mobile)</li>
              <li>AOT compilation</li>
              <li>Fast cold start</li>
              <li>Lightweight runtime</li>
              <li>Use the library of C/C++/Rust through C-ABI</li>
            </ul>
          </Card>
          <Card unactive>
            <h2>Target JavaScript(WIP)</h2>
            <ul className={styles.justifyList}>
              <li>Low overhead</li>
              <li>Readable</li>
              <li>Isolate environment</li>
            </ul>
          </Card>
        </div>

        {/* <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
        Copyright 2022 Vincent Chan
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )
}
