import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🧵 SakhiSilai API Documentation',
      version: '1.0.0',
      description: `
**SakhiSilai** - Hyperlocal Women Tailoring Platform for Small-Town India (*Ghar Se Hunar, Apni Kamai*).

### Features Covered in API:
- 📍 **Hyperlocal Tailor Discovery Engine** (Village, District, State filtering with distance scoring)
- 🧵 **Order Creation & Status Lifecycle Tracking** (Requested, Accepted, Cutting, Stitching, Quality Check, Ready, Completed)
- 📸 **Custom Design Bidding** (Customer photo upload, tailor quote submission & acceptance flow)
- 🔐 **Role-based Authentication** (Customer, Tailor, Admin)
- 📊 **Admin Analytics & Tailor Verification System**
- 💾 **SQLite Persistent Engine (\`sakhisilai.db\`)**
`,
      contact: {
        name: 'SakhiSilai Support Team',
        email: 'support@sakhisilai.org',
        url: 'https://github.com/arvi8080/SakhiSilai'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server (SQLite DB)'
      },
      {
        url: 'https://sakhisilai.onrender.com',
        description: 'Render Production Cloud Server'
      }
    ],
    components: {
      schemas: {
        TailorProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 't_sunita' },
            name: { type: 'string', example: 'Sunita Devi' },
            phone: { type: 'string', example: '9876543210' },
            village: { type: 'string', example: 'Mohanlalganj' },
            district: { type: 'string', example: 'Lucknow' },
            state: { type: 'string', example: 'Uttar Pradesh' },
            availability: { type: 'string', enum: ['available', 'busy', 'offline'], example: 'available' },
            rating: { type: 'number', example: 4.9 },
            reviewCount: { type: 'integer', example: 28 },
            completedOrdersCount: { type: 'integer', example: 42 },
            currentActiveOrders: { type: 'integer', example: 2 },
            maxActiveOrders: { type: 'integer', example: 5 },
            isVerified: { type: 'boolean', example: true },
            servicesOffered: {
              type: 'array',
              items: { type: 'string' },
              example: ['Blouse Stitching', 'Suit & Salwar', 'Kurti']
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'ord_1788774533865' },
            orderNumber: { type: 'string', example: 'SK-2026-626' },
            customerId: { type: 'string', example: 'u_pria' },
            customerName: { type: 'string', example: 'Priya Singh' },
            customerPhone: { type: 'string', example: '9812345678' },
            customerVillage: { type: 'string', example: 'Mohanlalganj' },
            customerDistrict: { type: 'string', example: 'Lucknow' },
            customerState: { type: 'string', example: 'Uttar Pradesh' },
            tailorId: { type: 'string', example: 't_sunita' },
            tailorName: { type: 'string', example: 'Sunita Devi' },
            categoryName: { type: 'string', example: 'Blouse Stitching' },
            designTitle: { type: 'string', example: 'Gold Border Embroidered Blouse' },
            price: { type: 'number', example: 450 },
            paymentStatus: { type: 'string', example: 'pending' },
            status: {
              type: 'string',
              enum: ['requested', 'accepted', 'fabric_received', 'cutting_started', 'stitching', 'quality_check', 'ready', 'completed', 'cancelled'],
              example: 'stitching'
            },
            createdAt: { type: 'string', example: '2026-09-07T09:48:53.865Z' }
          }
        },
        CustomDesignRequest: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'req_1788774589317' },
            customerId: { type: 'string', example: 'u_pria' },
            customerName: { type: 'string', example: 'Priya Singh' },
            customerVillage: { type: 'string', example: 'Mohanlalganj' },
            requestTitle: { type: 'string', example: 'Lehenga Choli Custom Stitching' },
            clothingCategory: { type: 'string', example: 'Lehenga' },
            referenceImage: { type: 'string', example: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2' },
            status: { type: 'string', example: 'open' },
            offers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/QuoteOffer'
              }
            }
          }
        },
        QuoteOffer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'off_1788774596179' },
            tailorId: { type: 'string', example: 't_sunita' },
            tailorName: { type: 'string', example: 'Sunita Devi' },
            price: { type: 'number', example: 1200 },
            estDays: { type: 'integer', example: 4 },
            note: { type: 'string', example: 'Includes heavy lining and piping' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          summary: 'API Health Check & Status',
          tags: ['System'],
          responses: {
            '200': {
              description: 'API Server is healthy and SQLite DB is connected',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      service: { type: 'string', example: 'SakhiSilai Hyperlocal Women Tailoring Backend API' },
                      database: { type: 'string', example: 'SQLite Persistent (sakhisilai.db)' },
                      timestamp: { type: 'string', example: '2026-09-07T09:46:27.830Z' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'User Login Endpoint',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    phone: { type: 'string', example: '9812345678' },
                    role: { type: 'string', enum: ['customer', 'tailor', 'admin'], example: 'customer' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Login successful' }
          }
        }
      },
      '/api/auth/register': {
        post: {
          summary: 'User Registration Endpoint',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Sushma Devi' },
                    phone: { type: 'string', example: '9811122233' },
                    role: { type: 'string', example: 'tailor' },
                    village: { type: 'string', example: 'Mohanlalganj' },
                    district: { type: 'string', example: 'Lucknow' },
                    state: { type: 'string', example: 'Uttar Pradesh' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'User registered successfully' }
          }
        }
      },
      '/api/tailors/nearby': {
        get: {
          summary: 'Find Hyperlocal Tailors Nearby',
          tags: ['Tailors'],
          parameters: [
            { name: 'state', in: 'query', schema: { type: 'string', default: 'Uttar Pradesh' } },
            { name: 'district', in: 'query', schema: { type: 'string', default: 'Lucknow' } },
            { name: 'village', in: 'query', schema: { type: 'string', default: 'Mohanlalganj' } }
          ],
          responses: {
            '200': {
              description: 'List of matching tailors ranked by proximity score',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 2 },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/TailorProfile' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/tailors/availability': {
        post: {
          summary: 'Update Tailor Work Availability',
          tags: ['Tailors'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tailorId: { type: 'string', example: 't_sunita' },
                    availability: { type: 'string', enum: ['available', 'busy', 'offline'], example: 'available' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Availability updated' }
          }
        }
      },
      '/api/orders': {
        get: {
          summary: 'Get Orders List',
          tags: ['Orders'],
          parameters: [
            { name: 'customerId', in: 'query', schema: { type: 'string' } },
            { name: 'tailorId', in: 'query', schema: { type: 'string' } }
          ],
          responses: {
            '200': {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 3 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create New Stitching Order',
          tags: ['Orders'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          },
          responses: {
            '201': { description: 'Order created successfully' }
          }
        }
      },
      '/api/orders/{id}/status': {
        patch: {
          summary: 'Update Order Lifecycle Status',
          tags: ['Orders'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'ord_1788774533865' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['requested', 'accepted', 'fabric_received', 'cutting_started', 'stitching', 'quality_check', 'ready', 'completed', 'cancelled'], example: 'stitching' },
                    labelEn: { type: 'string', example: 'Stitching in Progress' },
                    labelHi: { type: 'string', example: 'सिलाई जारी है' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Order status updated' }
          }
        }
      },
      '/api/custom-requests': {
        get: {
          summary: 'List Custom Design Photo Requests',
          tags: ['Custom Design Bidding'],
          parameters: [
            { name: 'village', in: 'query', schema: { type: 'string', example: 'Mohanlalganj' } }
          ],
          responses: {
            '200': { description: 'Custom requests list' }
          }
        },
        post: {
          summary: 'Post Custom Design Photo Request',
          tags: ['Custom Design Bidding'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CustomDesignRequest' }
              }
            }
          },
          responses: {
            '201': { description: 'Custom request created' }
          }
        }
      },
      '/api/custom-requests/{id}/quotes': {
        post: {
          summary: 'Submit Tailor Quote for Custom Design',
          tags: ['Custom Design Bidding'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'req_1788774589317' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/QuoteOffer' }
              }
            }
          },
          responses: {
            '200': { description: 'Quote submitted successfully' }
          }
        }
      },
      '/api/custom-requests/{id}/accept-quote': {
        post: {
          summary: 'Accept Quote Offer & Convert to Active Order',
          tags: ['Custom Design Bidding'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'req_1788774589317' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    offerId: { type: 'string', example: 'off_1788774596179' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Quote accepted and order created' }
          }
        }
      },
      '/api/admin/stats': {
        get: {
          summary: 'Platform System Metrics & Analytics',
          tags: ['Admin Console'],
          responses: {
            '200': {
              description: 'Platform metrics report',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          totalCustomers: { type: 'integer', example: 1 },
                          totalTailors: { type: 'integer', example: 2 },
                          verifiedTailors: { type: 'integer', example: 2 },
                          totalOrders: { type: 'integer', example: 3 },
                          activeOrders: { type: 'integer', example: 3 },
                          completedOrders: { type: 'integer', example: 0 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/admin/tailors/{id}/verify': {
        post: {
          summary: 'Verify or Revoke Tailor Profile',
          tags: ['Admin Console'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', example: 't_sunita' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isVerified: { type: 'boolean', example: true }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Tailor verification status updated' }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Serve Swagger UI documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SakhiSilai API Docs'
  }));

  // JSON format endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
