function App() {
     return (
          <main className='announcement'>
               <section
                    className='announcement-card'
                    aria-labelledby='announcement-title'
               >
                    <h1 id='announcement-title'>
                         IELTS mocks <br /> Coming soon.
                    </h1>
                    <p>
                         We are preparing a complete IELTS mock-test experience.
                         Check back soon for updates.
                    </p>
                    <a
                         className='teaching-link'
                         href='https://teaching.imock.ir/'
                    >
                         Visit Teaching Practice
                         <span aria-hidden='true'>→</span>
                    </a>
               </section>
          </main>
     )
}

export default App
