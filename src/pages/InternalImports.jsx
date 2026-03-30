import { useState } from 'react';
import Layout from '../components/Layout';
import { useGetAllImportSourcesQuery, useCreateImportSourceMutation, useUpdateImportSourceMutation } from '../api/importApi';

function InternalImports() {
  const { data: importSources = [], isLoading } = useGetAllImportSourcesQuery();
  const [createImportSource] = useCreateImportSourceMutation();
  const [updateImportSource] = useUpdateImportSourceMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    certifications: '',
  });

  const handleAdd = () => {
    setEditingSource(null);
    setFormData({
      name: '',
      country: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      certifications: '',
    });
    setShowModal(true);
  };

  const handleEdit = (source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      country: source.country,
      contactPerson: source.contactPerson,
      email: source.email,
      phone: source.phone,
      address: source.address,
      certifications: source.certifications || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSource) {
        await updateImportSource({ id: editingSource.id, ...formData }).unwrap();
      } else {
        await createImportSource(formData).unwrap();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save import source:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Import Sources</h1>
          <p className="text-gray-600 mt-2">Manage international import sources and suppliers</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          + Add Import Source
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {importSources.map(source => (
            <div key={source.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                  <p className="text-sm text-gray-600">{source.country}</p>
                </div>
                <span className={`badge ${source.verified ? 'badge-success' : 'badge-warning'}`}>
                  {source.verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <p className="font-medium">{source.contactPerson}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{source.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{source.phone}</p>
                </div>
                {source.certifications && (
                  <div>
                    <span className="text-gray-600">Certifications:</span>
                    <p className="font-medium">{source.certifications}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleEdit(source)}
                className="btn btn-secondary w-full mt-4"
              >
                Edit Details
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-display font-bold mb-6">
                {editingSource ? 'Edit Import Source' : 'Add Import Source'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="e.g., Global Agri Exports"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="e.g., India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., ISO 9001, HACCP"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="input"
                      placeholder="Full address"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary">
                    {editingSource ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InternalImports;
