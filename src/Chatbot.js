export const Chatbot = (props) => {
    return(
            <div className="Chatbot">
            <>Chatbot</>
            <h3>CHATBOT GOES HERE</h3>
            <button onClick={() => props.onFormSwitch('login')}> Return to login</button>
            </div>
        )
}