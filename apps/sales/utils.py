"""
Invoice Generation Utilities for Pharmacy System
"""
from django.http import HttpResponse
from django.template.loader import render_to_string


def generate_invoice_html(sale, sale_items, company_info=None):
    """
    Generate HTML invoice for a sale.
    
    Args:
        sale: The Sale object
        sale_items: QuerySet of SaleItem objects
        company_info: Optional dict with company details
        
    Returns:
        HTML string for the invoice
    """
    if company_info is None:
        company_info = {
            'name': 'Pharmacy Yanje',
            'address': '123 Pharmacy Street, Paris, France',
            'phone': '+33 1 23 45 67 89',
            'email': 'contact@pharmacy.com',
            'siret': '123 456 789 00012'
        }
    
    context = {
        'sale': sale,
        'sale_items': sale_items,
        'company': company_info,
    }
    
    html_string = render_to_string('sales/invoice_template.html', context)
    return html_string


def render_invoice_to_pdf(sale, sale_items, company_info=None):
    """
    Return invoice as HTML response (PDF generation disabled due to dependencies).
    
    Args:
        sale: The Sale object
        sale_items: QuerySet of SaleItem objects
        company_info: Optional dict with company details
        
    Returns:
        HttpResponse with HTML content
    """
    html_string = generate_invoice_html(sale, sale_items, company_info)
    
    response = HttpResponse(html_string, content_type='text/html')
    filename = f"invoice_{sale.id}_{sale.date.strftime('%Y%m%d')}.html"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response


def get_invoice_html_response(sale, sale_items, company_info=None):
    """
    Return invoice as HTML response for preview.
    
    Args:
        sale: The Sale object
        sale_items: QuerySet of SaleItem objects
        company_info: Optional dict with company details
        
    Returns:
        HttpResponse with HTML content
    """
    html_string = generate_invoice_html(sale, sale_items, company_info)
    return HttpResponse(html_string)

