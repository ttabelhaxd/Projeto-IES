package ies.vamsbackend;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "VAMS API Documentation",
                version = "1.0.0",
                description = "API Documentation for VAMS",
                contact = @Contact(name = "Support Team", url = "https://github.com/detiuaveiro/ies-24-25-group-project-402/"),
                license = @License(name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html")
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local Server")
        }
)
public class SwaggerConfig {
  
}
