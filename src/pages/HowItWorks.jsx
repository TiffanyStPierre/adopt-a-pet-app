export default function HowItWorks() {
    return (
        <div className='hiw-content'>
            <h2>How it works</h2>
            <section className='hiw-section'>
                <h3 className='hiw-subtitle'>Listing A Pet</h3>
                <ul className='hiw-list'>
                    <li>Only pets residing in Canada may be listed</li>
                    <li>Pets may not be shipped to another location outside of Canada</li>
                    <li>Adoption fees may not be more than $500</li>
                    <li>Both organizations & individuals may list pets for adoption</li>
                    <li>Our adoption counsellors will contact each lister after their first listing is posted to vet the lister before an adoption can be finalized</li>
                </ul>
            </section>
            <section className='hiw-section'>
                <h3 className='hiw-subtitle'>Adopting A Pet</h3>
                <ul className='hiw-list'>
                    <li>Only residents of Canada may adopt pets</li>
                    <li>Our adoption counsellors will contact each potential adopter before an adoption is finalized to ensure the adopter and pet are a good match</li>
                </ul>
            </section>
        </div>
    )
}