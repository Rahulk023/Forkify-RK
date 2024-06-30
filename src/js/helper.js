//in helper you use the function common one whicg can use across the project
import { TIME_OUT as sec } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(sec)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const deleteRecipe = async function (url) {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
    });

    // Check if the response indicates success (no content expected)
    if (!res.ok) {
      const data = await res.json(); // Try to parse JSON error message if available
      throw new Error(
        `${data.message || 'Failed to delete recipe'} (${res.status})`
      );
    }

    return { message: 'Recipe deleted successfully' };
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const getRecipe = await Promise.race([fetchPro, timeout(sec)]); //

    const res = await getRecipe.json();
    if (!getRecipe.ok)
      throw new Error(`${res.message} status:${getRecipe.status}`);
    return res;
  } catch (errors) {
    throw errors;
  }
};

export const sentJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST', // Change 'type' to 'method' and use 'POST'
      headers: {
        'Content-Type': 'application/json', // Correct the typo
      },
      body: JSON.stringify(uploadData), // Ensure the body is JSON stringified
    });

  } catch (errors) {
    throw errors;
  }
};  */
