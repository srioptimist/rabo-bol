package com.bol;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@Path("/email")
public class SendMailTLS {
	
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
    public Response getTopSellers(MailDetails maildetails) throws JsonParseException, JsonMappingException, IOException {

		final String username = "sharpcookies2015@gmail.com";
		final String password = "password123$";
		
		System.out.println("To : " + maildetails.getEmailId());
		System.out.println("Content : " + maildetails.getContent());
		
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props,
		  new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		  });

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("sharpcookies2015@gmail.com"));
			message.setRecipients(Message.RecipientType.TO,
				InternetAddress.parse(maildetails.getEmailId()));
			message.setSubject("Testing Subject");
			message.setText(maildetails.getContent());

			Transport.send(message);

			System.out.println("Done");

		} catch (MessagingException e) {
			e.printStackTrace();
			//throw new RuntimeException(e);
		}
		
		
        return Response.status(Response.Status.OK).entity("OK").build();

    }

	
}