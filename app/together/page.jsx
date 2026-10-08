import styles from './together.module.css';

export const metadata = {
  title: 'Pick It Up Together | One better place',
  description: 'One person. One piece. One better place. Small everyday acts make our communities cleaner and brighter. Find your local Pick It Up community.',
};

export default function TogetherPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#communities">Choose your community</a>
      <header className={styles.header}>
        <a href="/together" className={styles.brand} aria-label="Pick It Up Together home">Pick It Up <span>Together</span></a>
        <a href="#communities" className={styles.nav}>Find your community</a>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Small acts. Shared pride.</p>
        <h1>One person.<br />One piece.<br /><span>One better place.</span></h1>
        <p className={styles.intro}>Imagine… if every person left every place better than they found it.</p>
        <p className={styles.description}>Pick up a piece of litter. Celebrate someone who cares. Help children discover the difference they can make. A better place starts with each of us.</p>
        <a href="#communities" className={styles.button}>Find your community</a>
      </section>
      <section id="communities" className={styles.communities} aria-labelledby="community-heading">
        <p className={styles.eyebrow}>Together, wherever we are</p>
        <h2 id="community-heading">Where will you make a difference?</h2>
        <div className={styles.cards}>
          <article className={styles.card}>
            <p className={styles.label}>Our first community</p>
            <h3>Washington</h3>
            <p>Rooted in Seattle. Open to everyone who wants to leave Washington a little better.</p>
            <p>Explore cleanup stories, share community kindness, and discover activities for kids through Pick It Up Seattle.</p>
            <a className={styles.button} href="https://pickitupseattle.org">Explore Washington</a>
            <p className={styles.note}>Visit our existing Pick It Up Seattle website.</p>
          </article>
          <article className={styles.card}>
            <p className={styles.label}>Coming soon</p>
            <h3>Arizona</h3>
            <p>Desert beauty. Community pride. Small acts that make a lasting difference.</p>
            <p>We’re preparing an Arizona experience with children’s learning materials and ways to care for the places we share.</p>
            <p className={styles.soon}>Pick It Up Arizona is on its way.</p>
          </article>
        </div>
        <p className={styles.anywhere}>Live somewhere else? You can start today. See litter? Pick it up safely. Every small act counts, wherever you call home.</p>
      </section>
      <section className={styles.mission}>
        <h2>A little care goes a long way.</h2>
        <p>Cleaner streets. Kinder communities. Children who know their actions matter.</p>
        <p>Pick It Up Together brings the spirit of Pick It Up Seattle to more places, one community at a time.</p>
      </section>
      <footer className={styles.footer}>
        <p>Pick It Up Together is an initiative of Pick It Up Seattle, a 501(c)(3) nonprofit.</p>
        <nav aria-label="Footer"><a href="https://pickitupseattle.org/contact">Contact us</a><a href="https://pickitupseattle.org/privacy">Privacy</a></nav>
      </footer>
    </main>
  );
}
