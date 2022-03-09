import { request, getBase } from '../modules/request';

const PROFILE_API = getBase('profile');
const AUTH_API = getBase('auth');
const USERS_API = getBase('users');
const PRODUCTS_API = getBase('products');
const JOURNAL_API = getBase('journal');

export const loadProfileData = () => request.get(PROFILE_API()).then(resp => resp.data);
export const updateProfileData = data => request.put(PROFILE_API(), data).then(resp => resp.data);
export const inviteFriend = data => request.post(PROFILE_API('/invite-friend'), data).then(resp => resp.data);
export const removeFriend = id => request.delete(PROFILE_API(`/remove-friend/${id}`)).then(resp => resp.data);

export const login = data => request.post(AUTH_API('/login'), data).then(resp => resp.data);
export const signup = data => request.post(AUTH_API('/signup'), data).then(resp => resp.data);

export const loadJournalData = ({ limit, offset, fromDate, dueDate, userId }) =>
  request.get(JOURNAL_API('/'), { params: { limit, offset, fromDate, dueDate, userId } }).then(resp => resp.data);
export const loadJournalReport = ({ fromDate, dueDate }) =>
  request.get(JOURNAL_API('/report'), { params: { fromDate, dueDate } }).then(resp => resp.data);
export const loadJournalStatistics = () => request.get(JOURNAL_API('/statistic')).then(resp => resp.data);
export const addJournalData = data => request.post(JOURNAL_API('/'), data).then(resp => resp.data);
export const editJournalData = (id, data) => request.put(JOURNAL_API(`/${id}`), data).then(resp => resp.data);
export const deleteJournalData = id => request.delete(JOURNAL_API(`/${id}`)).then(resp => resp.data);


export const loadProducts = ({ limit, offset, name }) =>
  request.get(PRODUCTS_API('/'), { params: { limit, offset, name } }).then(resp => resp.data);
export const addProducts = data => request.post(PRODUCTS_API('/'), data).then(resp => resp.data);
export const editProducts = (id, data) => request.put(PRODUCTS_API(`/${id}`), data).then(resp => resp.data);
export const deleteProducts = id => request.delete(PRODUCTS_API(`/${id}`)).then(resp => resp.data);

export const loadUsers = ({ limit, offset, name }) =>
  request.get(USERS_API('/'), { params: { limit, offset, name } }).then(resp => resp.data);
export const editUsers = (id, data) => request.put(USERS_API(`/${id}`), data).then(resp => resp.data);
export const deleteUsers = id => request.delete(USERS_API(`/${id}`)).then(resp => resp.data);
