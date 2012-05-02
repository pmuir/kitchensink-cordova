/*
 * JBoss, Home of Professional Open Source
 * Copyright 2012, Red Hat, Inc., and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
Core JavaScript functionality for the application.  Performs the required
Restful calls, validates return values, and populates the member table.
 */

/* Get the member template */
function getMemberTemplate() {
    $.ajax({
        url: "tmpl/templates.tmpl",
        dataType: "html",
        success: function( data ) {
            $( "head" ).append( data );
            updateMemberTable();
        }
    });
}

/* Builds the updated table for the member list */
function buildMemberRows(members) {
    return _.template( $( "#member-tmpl" ).html(), {"members": members});
}

/* Uses JAX-RS GET to retrieve current member list */
function updateMemberTable( manual ) {
    $.ajax({
        url: "http://poh5-aerogear.rhcloud.com/rest/members",
        cache: false,
        success: function(data) {
        	var members = $( "#members" );
            members.html(buildMemberRows(data));
            if ( manual ) {
            	if ( navigator.contacts ) {
            		members.find( "button" ).button();
            	} else {
            		$( ".contactCell" ).remove();
            	}
            }
        },
        error: function(error) {
            //console.log("error updating table -" + error.status);
        }
    });
}

/*
Attempts to register a new member using a JAX-RS POST.  The callbacks
the refresh the member table, or process JAX-RS response codes to update
the validation errors.
 */
function registerMember(memberData) {
    //clear existing  msgs
    $('span.invalid').remove();
    $('span.success').remove();

    $.ajax({
        url: 'http://poh5-aerogear.rhcloud.com/rest/members',
        contentType: "application/json",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(memberData),
        success: function(data) {
            //console.log("Member registered");

            //clear input fields
            $('#reg')[0].reset();

            //mark success on the registration form
            $('#formMsgs').append($('<span class="success">Member Registered</span>'));

            updateMemberTable();
        },
        error: function(error) {
            if ((error.status == 409) || (error.status == 400)) {
                //console.log("Validation error registering user!");

                var errorMsg = $.parseJSON(error.responseText);

                $.each(errorMsg, function(index, val) {
                    $('<span class="invalid">' + val + '</span>').insertAfter($('#' + index));
                });
            } else {
                //console.log("error - unknown server issue");
                $('#formMsgs').append($('<span class="invalid">Unknown server error</span>'));
            }
        }
    });
}

// Initialize application
$( document ).ready( function() {
    //Fetches the initial member data and populates the table using jquery templates
    getMemberTemplate();

    //Register an event listener on the sumbit action
    $('#reg').submit(function(event) {
        event.preventDefault();

        var memberData = $(this).serializeObject();
        //Workaround for jQM adding a hidden field for submit buttons which then
        //gets serialized into the form values
        if ( memberData.register ) {
            delete memberData.register;
        }
        registerMember(memberData);
    });

    //Register the cancel listener
    $('#cancel').click(function(event) {
        //clear input fields
        $('#reg')[0].reset();

        //clear existing msgs
        $('span.invalid').remove();
        $('span.success').remove();
    });

    $("#memberRefreshButton").click(function(event) {
        updateMemberTable( true );
    });

    document.addEventListener( "deviceready", function() {
        //verify access to contacts
        if ( navigator.contacts ) {
            //fetch users contacts and populate page in background
            navigator.contacts.find(
                [ "displayName", "phoneNumbers", "emails" ],
                function( data ) {
                    var list = $( "#contactList" );
                    list.html( _.template( $("#contact-tmpl").html(), { contacts: data } ) );
                },
                function( error ) {
                    alert( error );
                },
                { multiple: true }
            );

	        //opens a list of contacts from the device
            $( "#contactSelectButton" ).click( function( event ) {
            	$.mobile.changePage( "#contactPage", { transition: "pop" } );
            });

            //add a member to your contacts
            $( "#contactPage" ).on( "click", ".contact-link", function( event ) {
                event.preventDefault();

                var target = $( event.target );
                $( "#name" ).val( target.data( "display-name" ) );
                $( "#email" ).val( target.data( "email" ) );
                $( "#phoneNumber" ).val( target.data( "phone" ) );

                $.mobile.changePage( "#register-art", { direction: "reverse" } );
            })
            .on( "pagebeforeshow", function( event ) {
                $( "#contactList" ).listview( "refresh" );
            });
            
            //Add member to contacts
            $( "#members" ).on( "click", ".addContactButton", function( event ) {
            	var target = $( event.target );
            	navigator.notification.confirm(
            		"Are you sure you want to add " + target.data( "cname" ) + " to your contacts?",
            		function( button ) {
            			if ( button == 1 ) {
                            var contact = navigator.contacts.create(),
                                name = new ContactName(),
                                names = target.data( "cname" ).split( " " );
    	            		contact.displayName = target.data( "cname" );
                            contact.nickname = target.data( "cname" );
                            name.formatted = target.data( "cname" );
                            if ( names.length > 1 ) {
                            	name.familyName = names[1];
                            	name.givenName = names[0];
                            }
                            contact.name = name;
    	            		contact.emails = [ new ContactField( "home", target.data( "cemail" ), true ) ];
                            contact.phoneNumbers = [ new ContactField( "home", target.data( "cphone" ).toString(), true ) ];

            				contact.save(
                                function( contact ) {
                                    navigator.notification.alert( contact.nickname + " has been added to your contacts.", function(){} );
                                },
                                function( contactError ) {
                                    navigator.notification.alert( JSON.stringify(contactError), function(){} );
                                }
                            );
            			}
            		}
            	);
            });
        } else {
            $( "#contactSelectButton, .contactCell" ).remove();
        }
    }, false );
});

//Serialize a form to an object
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
