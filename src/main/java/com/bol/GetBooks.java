package com.bol;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.bol.api.openapi_4_0.SearchResults;
import com.bol.openapi.OpenApiClient;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@Path("/books")
public class GetBooks {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{keyWord}")
    public Response getContents(@PathParam("keyWord")final String keyWord) throws JsonParseException, JsonMappingException, IOException {
        final String apiKey = "DE29770CFA144BA79FFEAC24002E1D66";
        OpenApiClient client = OpenApiClient.withDefaultClient(apiKey);
        SearchResults results = client.searchBuilder().term(keyWord).term("boek").search();
        return Response.status(Response.Status.OK).entity(results).build();

    }

}
