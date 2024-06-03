from flask import Flask, request, jsonify, render_template

import xmlrpc.client
from datetime import datetime
import json

app = Flask(__name__)

# Replace with your server's URL and credentials
# Information for the Odoo server access
url = "https://kontakt.com.tn"
db = "AllFashions"
username = 'fmh@demcointer.com'
password = 'dmc@280467'


@app.route('/')
def index():
    # Render the search.html template
    return render_template('search.html')

@app.route('/api/products', methods=['POST'])
def get_products():
    # Parse input data from JSON in the request body
    data = request.json
    category_pattern = data.get('category_pattern')

    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    # Set up the common endpoint and authenticate
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
    uid = common.authenticate(db, username, password, {})

    # Set up the object endpoint
    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

    # Define the search domain with the category pattern and list price if provided
    domain = [['is_published', '=', True], ['barcode', '!=', False], ['hide_on_website', '=', False]]
    if category_pattern is not None:
        domain.append(['categ_id', 'ilike', category_pattern])
    if min_price is not None:
        domain.append(['list_price', '>=', min_price])
    if max_price is not None:
        domain.append(['list_price', '<=', max_price])

    # Search and read products matching the criteria
    product_data = models.execute_kw(
        db, 
        uid, 
        password,
        'product.product',
        'search_read',
        [domain],
        {
            'fields': [ 'website_url','categ_id'],
        }
    )

    # Return the data as JSON
    return jsonify(product_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
