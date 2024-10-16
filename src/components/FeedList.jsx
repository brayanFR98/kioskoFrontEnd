import React, { useState, useEffect } from 'react';
import { getFeeds, createFeed, updateFeed, deleteFeed } from '../services/api';
import Alerts from './Alerts';

const FeedList = ({ token }) => {
  const [feeds, setFeeds] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    isPublic: 0,
    topics: '',
    type: '',
    editorial: '',
    language: ''
  });
  const [editingFeedId, setEditingFeedId] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalFeeds, setTotalFeeds] = useState(0);
  const limit = 10;
  const [topicFilter, setTopicFilter] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt'); // O 'updatedAt'

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await getFeeds(token, page, limit, topicFilter, orderBy);
        setFeeds(response.data.feeds);
        setTotalFeeds(response.data.totalFeeds);
      } catch (error) {
        Alerts('Error al obtener los feeds', 'error');
      }
    };

    fetchFeeds();
  }, [token, page, topicFilter, orderBy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    });
  };

  const validateForm = () => {
    const { name, topics, type, editorial, language } = formData;
    if (!name || !topics || !type || !editorial || !language) {
      Alerts('Por favor, completa todos los campos.', 'info');
      return false;
    }
    const topicArray = topics.split(',').map((topic) => topic.trim());
    if (topicArray.length < 1 || topicArray.length > 5) {
      Alerts('Debes ingresar entre 1 y 5 topics.', 'info');
      return false;
    }
    const uniqueTopics = new Set(topicArray);
    if (uniqueTopics.size !== topicArray.length) {
      Alerts('Los topics no deben repetirse.', 'info');
      return false;
    }
    Alerts('Feed Creado/Actualizado', 'success');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    if (!validateForm()) {
      return;
    }

    try {
      const topicArray = formData.topics.split(',').map((topic) => topic.trim());

      const feedData = { ...formData, topics: topicArray };  // Crear objeto con datos del feed

      if (editingFeedId) {
        await updateFeed(editingFeedId, feedData, token);
        Alerts('Feed actualizado', 'success');
        setEditingFeedId(null);
      } else {
        Alerts('Feed creado', 'success');
        await createFeed(feedData, token);
      }

      setFormData({ name: '', isPublic: 0, topics: '', type: '', editorial: '', language: '' });
      const response = await getFeeds(token, page, limit);
      setFeeds(response.data.feeds);
    } catch (error) {
      Alerts('Error al crear/actualizar el feed', 'error');
    }
  };

  const handleEdit = (feed) => {
    setEditingFeedId(feed.id);
    setFormData({
      name: feed.name,
      isPublic: feed.public,
      topics: feed.topics.join(','),
      type: feed.type,
      editorial: feed.editorial,
      language: feed.language
    });
  };

  const handleDelete = async (feedId) => {
    try {
      await deleteFeed(feedId, token);
      const response = await getFeeds(token, page, limit);
      setFeeds(response.data.feeds);
      Alerts('Feed eliminado', 'info')
    } catch (error) {
      Alerts('Error al eliminar el feed', 'error');
    }
  };

  // filtros
  const handleFilterChange = (e) => {
    setTopicFilter(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Feed List</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">{editingFeedId ? 'Editar Feed' : 'Crear Nuevo Feed'}</h3>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">Titulo del Feed</label>
          <input
            type="text"
            name="name"
            placeholder="Titulo del Feed"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">Topics (separados por comas)</label>
          <input
            type="text"
            name="topics"
            placeholder="Topics (separados por comas)"
            value={formData.topics}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un tipo</option>
            <option value="Última Hora">Última Hora</option>
            <option value="Política">Política</option>
            <option value="Económia">Económia</option>
            <option value="Internacional">Internacional</option>
            <option value="Salud">Salud</option>
            <option value="Ambiental">Ambiental</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Deportiva">Deportiva</option>
            <option value="Cultural">Cultural</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Estilo de Vida">Estilo de Vida</option>
            <option value="Investigación">Investigación</option>
          </select>

        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">Editorial</label>
          <input
            type="text"
            name="editorial"
            placeholder="Editorial"
            value={formData.editorial}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">Idioma</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un idioma</option>
            <option value="esp">Español</option>
            <option value="eng">Inglés</option>
          </select>

        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic === 1}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-white">Público</label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingFeedId ? 'Actualizar Feed' : 'Registrar Feed'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6 bg-gray-700 rounded-md pl-4">Feeds Existentes</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Añadir campo para filtro por topic */}
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Filtrar por Topic</label>
          <input
            type="text"
            value={topicFilter}
            onChange={handleFilterChange}
            placeholder="Introduce el topic"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Añadir selector para orden */}
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Ordenar por</label>
          <select
            value={orderBy}
            onChange={handleOrderChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Fecha de Creación</option>
            <option value="updated_at">Fecha de Actualización</option>
          </select>
        </div>
      </form>

      <ul className="mt-2 space-y-2">
        {feeds.map((feed) => (
          <li key={feed.id} className="p-2 border border-gray-300">
            <strong>{feed.name}</strong> - {feed.public === 1 ? 'Público' : 'Privado'}
            <br />
            Topics: {feed.topics.join(', ')}
            <br />
            Tipo: {feed.type}
            <br />
            Editorial: {feed.editorial}
            <br />
            Idioma: {feed.language}
            <br />
            Creado por: {feed.username}
            <br />
            Date: {feed.created_at}
            <br />
            Updated Date: {feed.updated_at}

            <button
              className="ml-4 text-blue-500"
              onClick={() => handleEdit(feed)}
            >
              Editar
            </button>
            <button
              className="ml-4 text-red-500"
              onClick={() => handleDelete(feed.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalFeeds / limit) }, (_, index) => (
          <button
            key={index}
            className={`py-2 px-4 mx-1 ${page === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'} rounded-md`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedList;
