function App() {
     return (
          <main className='announcement'>
               <section
                    className='announcement-card'
                    aria-labelledby='announcement-title'
               >
                    <span className='eyebrow'>iMock</span>
                    <h1 id='announcement-title'>
                         IELTS mock tests are coming soon.
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
