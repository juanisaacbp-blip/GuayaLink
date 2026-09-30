import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  onAuthStateChanged,
  User
} from 'firebase/auth';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../main';


export type UserRole =
  | 'client'
  | 'admin'
  | 'worker';


function waitForAuth():
Promise<User | null> {

  return new Promise(
    resolve => {

      let unsubscribe =
        () => {};


      unsubscribe =
        onAuthStateChanged(
          auth,
          user => {

            unsubscribe();

            resolve(user);

          },
          () => {

            unsubscribe();

            resolve(null);

          }
        );

    }
  );

}


async function readRole(
  uid: string
): Promise<UserRole> {

  const snapshot =
    await getDoc(
      doc(
        db,
        'users',
        uid
      )
    );


  if (!snapshot.exists()) {

    return 'client';

  }


  const role =
    snapshot.data()['role'];


  if (
    role === 'admin' ||
    role === 'worker' ||
    role === 'client'
  ) {

    return role;

  }


  return 'client';

}


function homeForRole(
  role: UserRole
): string {

  if (role === 'admin') {

    return '/admin';

  }


  if (role === 'worker') {

    return '/trabajador';

  }


  return '/dashboard';

}


export function roleGuard(
  ...allowedRoles: UserRole[]
): CanActivateFn {

  return async () => {

    const router =
      inject(Router);


    const user =
      auth.currentUser ??
      await waitForAuth();


    if (!user) {

      return router.parseUrl(
        '/login'
      );

    }


    const role =
      await readRole(
        user.uid
      );


    if (
      allowedRoles.includes(
        role
      )
    ) {

      return true;

    }


    return router.parseUrl(
      homeForRole(
        role
      )
    );

  };

}