import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';

const CodeRunner = dynamic(() => import('./codeRunner'), {
  ssr: false
})

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
    <a href="https://github.com/lichenscript/lichenscript">
      <Image src="/GitHub-Mark-120px-plus.png" width={36} height={36} />
    </a>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <GithubIcon />
      </div>
      <Head>
        <title>LichenScript</title>
        <meta name="description" content="A lightweight language compiled to JavaScript/C." />
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-322TTNCM99"/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-322TTNCM99');
            `,
          }}
        />
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

        <div className={styles.docContainer}>
          <a className={styles.docButton} href="https://github.com/lichenscript/lichenscript">Github</a>
          <a className={styles.docButton} href="https://docs.lichenscript.com/">Documents</a>
        </div>

        <div className={styles.feature}>
          <Card>
            <h2>Features</h2>
            <ul className={styles.justifyList}>
              <li>Modern syntaxes, close to TypeScript/JavaScript</li>
              <li>Static typing</li>
              <li>Pattern matching</li>
            </ul>
          </Card>
        </div>

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
          <Card>
            <h2>Target JavaScript</h2>
            <ul className={styles.justifyList}>
              <li>Low overhead</li>
              <li>Readable</li>
              <li>Isolate environment</li>
            </ul>
          </Card>
        </div>

        <CodeRunner />

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
