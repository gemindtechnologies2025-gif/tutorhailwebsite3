#!/bin/bash

# Remove the existing 'web' folder if it exists
rm -rf web

# Rename 'build' folder to 'web'
mv build web

# Create the .htaccess file with the specified content
cat <<EOL > web/.htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    # -- REDIRECTION to https (optional):
    # If you need this, uncomment the next two commands
    # RewriteCond %{HTTPS} !on
    # RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}
    # --
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^.*$ - [NC,L]
    RewriteRule ^(.*) index.html [NC,L]
</IfModule>
EOL
