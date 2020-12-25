import { AppHeader } from '../../cmps/App-header.jsx'
import { MailService } from '../gmail/services/mail-service.js'
import { EmailList } from '../gmail/cmps/Email-list.jsx'
import { EmailOptions } from '../gmail/cmps/Email-options.jsx'
import { EmailFilter } from '../gmail/cmps/Email-filter.jsx'
import { eventBusService } from  '../../services/eventBusService.js'
import { UserMsg } from '../gmail/cmps/Email-UserMsg.jsx'


export class MailApp extends React.Component {

    state = {
        emails:[],
        filterBy:{
            subject:''
        },
        selectedEmail:null,
        comeposClicked:false,
        newEmail:{
            subject:'',
            body:''
        },
        deleteClicked:false,
        isDelete:false,



    }

    /// INIT
    componentDidMount(){
        this.loadEmail()

    }

    loadEmail = () =>{
        const emails = MailService.query()
        this.setState({
            emails
        })
        // console.log(emails);
    }


    getEmailsForDisplay = () =>{
        const {filterBy} = this.state
        return this.state.emails.filter((email) =>{
            return email.subject.toLowerCase().includes(filterBy.subject.toLowerCase())
        })

    }
    onEmailPreview = (email) =>{
        console.log('email:' , email);
        this.setState({
            selectedEmail : email
        })

    }


    onEmailDelete = (email) =>{
        console.log('deliting email' , email);
        var areUSure = confirm('Are you sure that you want to delete this Email?')

        if(areUSure){
            var copyEmail = MailService.deleteEmail(email.id)
            // console.log(copyEmail);
            this.setState({
                emails : copyEmail
            })
        }
        else return
    }



    // onEmailDelete = (email) =>{
    //     this.setState({deleteClicked:true})

    //     var areUSure = this.state.isDelete
    //     console.log(areUSure);

    //     if(this.state.isDelete){
    //         var copyEmail = MailService.deleteEmail(email.id)
    //         this.setState({
    //             emails : copyEmail,

    //         })
    //     }
    //     else return
    // }

    




    onCloseModal = () =>{
        this.setState({
            selectedEmail :null,
            comeposClicked : false
          })
    }

      onMakeAnEmail = () =>{
        console.log('making email');

        this.setState({
            comeposClicked: true
        })


    }


    onSetFilter = (filterBy) => {
        console.log("filterBy", filterBy);
        this.setState({ filterBy });
      };
    

    onSendEmail = (ev) =>{
        ev.preventDefault();
        ////// nice message of email sent goes here //////////
        eventBusService.emit('addemail' , {type: 'success' , txt: 'Your Email was successfully added!'})
        ///////////// FUNCTION ADD GOES HERE //////////
        MailService.addEmail(this.state.newEmail).then(email =>{
            console.log('Email sent!' ,email );
            this.onAdd()


        })

        this.setState({
            comeposClicked : false
        })

    }


    onAdd = () =>{
        this.loadEmail()

    }

    onInputChange = (ev) =>{

        const email = {...this.state.newEmail}
        email[ev.target.name] = ev.target.value 

        this.setState({
            newEmail : email
        })
    }

    // onYesClicked =()=>{
    //     console.log('YES CLICKED');
    //     this.setState({
    //         isDelete : true,
    //         deleteClicked : false

    //     })
    // }
    // onNoClicked =()=>{
    //     console.log('NO CLICKED');
    //     this.setState({
    //         deleteClicked : false
    //     })
    // }

    render() {
        return (
            <section>
                
                {/* <AppHeader /> */}
                <UserMsg />
                <EmailFilter setFilter = {this.onSetFilter}/>
                <section className="email-container">
                    
                        <EmailOptions onMakeAnEmail={this.onMakeAnEmail}/>
                    <div className="email-list-container">
                        <EmailList emails={this.getEmailsForDisplay()} onEmailPreview={this.onEmailPreview} onEmailDelete={this.onEmailDelete}/>
                    </div>

                </section>

                {this.state.selectedEmail && <div className="modal">
                    <div className="modal-content">

                    <div className="modal-header">
                        <span className="close" onClick={()=>this.onCloseModal()}>&times;</span>
                        <h2>{this.state.selectedEmail.subject}</h2>
                    </div>


                    <div className="modal-body">
                        <p>{this.state.selectedEmail.body}</p>
                    </div>


                    </div>
                    </div>}


                {this.state.comeposClicked && <div className="modal">
                    <form className="modal-content" onSubmit={this.onSendEmail}>

                        <div className="modal-header-comepos">
                            <span className="close-compose" onClick={()=>this.onCloseModal()}>&times;</span>
                            <input name="subject" type="text" placeholder="Subject" className="modal-compose-subject" onChange={this.onInputChange}/>
                        </div>

                        <div className="modal-body-compose">
                            <textarea name="body" id="" className="modal-compose-body" placeholder="Text goes here" onChange={this.onInputChange}></textarea>


                        </div>
                    
                        <button type="submit" className="modal-compose-submit">Submit</button>



                    </form>
                    </div>}

                    {/* {this.state.deleteClicked && <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h2>Are you sure you want to delete this Email?</h2>
                        </div>

                        <div className="modal-body">
                            <button onClick={()=>this.onYesClicked()}>Yes</button>
                            <button onClick={()=>this.onNoClicked()}>No</button>
                        </div>


                        </div>
                        

                        
                    
                    </div>} */}



            </section>
        )
    }
}

