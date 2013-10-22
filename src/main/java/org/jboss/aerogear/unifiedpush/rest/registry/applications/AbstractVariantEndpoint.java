package org.jboss.aerogear.unifiedpush.rest.registry.applications;

import org.jboss.aerogear.unifiedpush.model.AndroidVariant;
import org.jboss.aerogear.unifiedpush.rest.AbstractBaseEndpoint;
import org.jboss.aerogear.unifiedpush.service.AndroidVariantService;
import org.jboss.aerogear.unifiedpush.service.GenericVariantService;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.UUID;
import org.jboss.aerogear.unifiedpush.api.Variant;

/**
 * Created with IntelliJ IDEA.
 * User: sebastien
 * Date: 10/22/13
 * Time: 2:18 PM
 * To change this template use File | Settings | File Templates.
 */
public class AbstractVariantEndpoint extends AbstractBaseEndpoint{

    @Inject
    private GenericVariantService genericVariantService;


    // UPDATE (Secret Reset)
    @PUT
    @Path("/{variantId}/reset")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response resetSecret(@PathParam("variantId") String variantId) {

        Variant variant = genericVariantService.findByVariantID(variantId);

        if (variant != null) {
            // generate the new 'secret' and apply it:
            String newSecret = UUID.randomUUID().toString();
            variant.setSecret(newSecret);
            genericVariantService.updateVariant(variant);

            return Response.ok(variant).build();
        }

        return Response.status(Response.Status.NOT_FOUND).entity("Could not find requested PushApplication").build();
    }



}
