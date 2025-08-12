import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { disconnect } from "../reducers/user";

export default function ReglagesScreen() {
  const navigation = useNavigation();
  const token = useSelector((s) => s?.user?.value?.token);
  const dispatch = useDispatch();

  const BASE_URL = useMemo(() => {
    const raw = process.env.EXPO_PUBLIC_IP || "";
    return raw.replace(/\/+$/, "");
  }, []);

  // États des modales et des formulaires
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Déconnexion via le reducer user (supprime le token et remet à l'état initial)
  const logout = () => {
    setShowLogoutModal(false);
    dispatch(disconnect(navigation));
  };

  // Fonction de validation d'email (à ajouter avant les autres fonctions)
  const validateEmail = (email) => {
    // Regex pour valider le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Vérifications multiples
    if (!email) {
      return { isValid: false, error: "Email requis" };
    }

    if (email.length < 5) {
      return {
        isValid: false,
        error: "Email trop court (minimum 5 caractères)",
      };
    }

    if (email.length > 254) {
      return {
        isValid: false,
        error: "Email trop long (maximum 254 caractères)",
      };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Format d'email invalide" };
    }

    // Vérification des caractères interdits
    if (email.includes(" ")) {
      return {
        isValid: false,
        error: "L'email ne peut pas contenir d'espaces",
      };
    }

    return { isValid: true, error: null };
  };

  // Garde-fous avant les fetch
  const guardNetwork = () => {
    if (!BASE_URL) {
      console.log(
        "Configuration requise",
        "EXPO_PUBLIC_IP est manquant. Définissez process.env.EXPO_PUBLIC_IP."
      );
      return false;
    }
    if (!token) {
      console.log(
        "Session requise",
        "Aucun token trouvé. Il faut te reconnecter."
      );
      return false;
    }
    return true;
  };

  // ACTION: Changer l'email + déconnexion
  const submitChangeEmail = async () => {
    if (!guardNetwork()) return;
    // Validation de l'email
    const emailValidation = validateEmail(newEmail);
    if (!emailValidation.isValid) {
      Alert.alert("Email invalide", emailValidation.error);
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ email: newEmail.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok || data?.result === false) {
        console.log(data?.error || "Erreur lors de la modification de l'email");
      }
      setShowEmailModal(false);
      setNewEmail("");
      Alert.alert("Succès", "Email modifié. Tu va être déconnecté.", [
        {
          text: "OK",
          onPress: () => dispatch(disconnect(navigation)),
        },
      ]);
    } catch (e) {
      console.log("Erreur", String(e.message || e));
    } finally {
      setEmailLoading(false);
    }
  };

  // ACTION: Changer le mot de passe + déconnexion
  const submitChangePassword = async () => {
    if (!guardNetwork()) return;
    if (!currentPassword || !newPassword) {
      Alert.alert("Champs requis", "Veuillez remplir les deux champs.");
      return;
    }
    if (
      currentPassword.length < 8 ||
      currentPassword.length > 32 ||
      newPassword.length < 8 ||
      newPassword.length > 32
    ) {
      Alert.alert(
        "Mot de passe invalide",
        "Les mots de passe doivent contenir entre 8 et 32 caractères."
      );
      return;
    }
    setPassLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok || data?.result === false) {
        console.log(
          data?.error || "Erreur lors de la modification du mot de passe"
        );
      }
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert("Succès", "Mot de passe modifié. Tu vas être déconnecté.", [
        {
          text: "OK",
          onPress: () => dispatch(disconnect(navigation)),
        },
      ]);
    } catch (e) {
      console.log("Erreur", String(e.message || e));
    } finally {
      setPassLoading(false);
    }
  };

  // ACTION: Désactiver le compte + déconnexion
  const confirmDeactivate = async () => {
    if (!guardNetwork()) return;
    setDeactivateLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/desactivateAccount`, {
        method: "PUT",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok || data?.result === false) {
        console.log(data?.error || "Erreur lors de la désactivation du compte");
      }
      setShowDeactivateModal(false);
      Alert.alert(
        "Compte désactivé",
        "Ton compte a été désactivé. Tu va être déconnecté.",
        [
          {
            text: "OK",
            onPress: () => dispatch(disconnect(navigation)),
          },
        ]
      );
    } catch (e) {
      console.log("Erreur", String(e.message || e));
    } finally {
      setDeactivateLoading(false);
    }
  };

  // ACTION: Supprimer le compte + déconnexion
  const confirmDelete = async () => {
    if (!guardNetwork()) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/deleteAccount`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok || data?.result === false) {
        console.log(ata?.error || "Erreur lors de la suppression du compte");
      }
      setShowDeleteModal(false);
      Alert.alert(
        "Compte supprimé",
        "Ton compte a été définitivement supprimé.",
        [
          {
            text: "OK",
            onPress: () => dispatch(disconnect(navigation)),
          },
        ]
      );
    } catch (e) {
      console.log("Erreur", String(e.message || e));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Réglages</Text>

        <View style={styles.actions}>
          <SmallButton
            label="Changer l'email"
            onPress={() => setShowEmailModal(true)}
            keyboardType="email-address"
          />
          <SmallButton
            label="Changer le mot de passe"
            onPress={() => setShowPasswordModal(true)}
          />
          <SmallButtonDarkFirst
            label="Se déconnecter"
            onPress={() => setShowLogoutModal(true)}
          />
          <SmallButtonDark
            label="Désactiver le compte"
            onPress={() => setShowDeactivateModal(true)}
          />
          <SmallButtonDanger
            label="Supprimer le compte"
            onPress={() => setShowDeleteModal(true)}
          />
        </View>
      </ScrollView>

      {/* Modale -- Changer l'email */}
      <BaseModal
        visible={showEmailModal}
        onRequestClose={() => setShowEmailModal(false)}
        title="Changer l'email"
      >
        <Text style={styles.modalText}>Nouvel email</Text>
        <TextInput
          style={styles.modalInput}
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="ex: user@example.com"
          placeholderTextColor="#9f8f88"
          keyboardType="email"
        />
        <View style={styles.modalRow}>
          <SecondaryButton
            label="Annuler"
            onPress={() => setShowEmailModal(false)}
          />
          <PrimaryButton
            label={emailLoading ? "" : "Valider"}
            onPress={submitChangeEmail}
            disabled={emailLoading}
          >
            {emailLoading && <ActivityIndicator color="#fff" />}
          </PrimaryButton>
        </View>
      </BaseModal>

      {/* Modale -- Changer le mot de passe */}
      <BaseModal
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
        title="Changer le mot de passe"
      >
        <Text style={styles.modalText}>Mot de passe actuel</Text>
        <TextInput
          style={styles.modalInput}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#9f8f88"
        />
        <Text style={[styles.modalText, { marginTop: 12 }]}>
          Nouveau mot de passe (8-32)
        </Text>
        <TextInput
          style={styles.modalInput}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#9f8f88"
        />
        <View style={styles.modalRow}>
          <SecondaryButton
            label="Annuler"
            onPress={() => setShowPasswordModal(false)}
          />
          <PrimaryButton
            label={passLoading ? "" : "Enregistrer"}
            onPress={submitChangePassword}
            disabled={passLoading}
          >
            {passLoading && <ActivityIndicator color="#fff" />}
          </PrimaryButton>
        </View>
      </BaseModal>

      {/* Modale -- Désactiver le compte */}
      <BaseModal
        visible={showDeactivateModal}
        onRequestClose={() => setShowDeactivateModal(false)}
        title="Désactiver le compte"
      >
        <Text style={styles.modalWarn}>
          Ton compte sera désactivé et ton profil ne sera plus présenté aux
          autres utilisateurs. Continuer ?
        </Text>
        <View style={styles.modalRow}>
          <SecondaryButton
            label="Annuler"
            onPress={() => setShowDeactivateModal(false)}
          />
          <PrimaryButton
            label={deactivateLoading ? "" : "Désactiver"}
            onPress={confirmDeactivate}
            disabled={deactivateLoading}
          >
            {deactivateLoading && <ActivityIndicator color="#fff" />}
          </PrimaryButton>
        </View>
      </BaseModal>

      {/* Modale -- Supprimer le compte */}
      <BaseModal
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        title="Supprimer le compte"
      >
        <Text style={styles.modalWarn}>
          Es-tu sûr.e de vouloir supprimer ton compte ? Cette action est
          irréversible et supprimera toutes tes données (informations, matchs,
          conversations...).
        </Text>
        <View style={styles.modalRow}>
          <SecondaryButton
            label="Annuler"
            onPress={() => setShowDeleteModal(false)}
          />
          <DangerButton
            label={deleteLoading ? "" : "Supprimer"}
            onPress={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading && <ActivityIndicator color="#fff" />}
          </DangerButton>
        </View>
      </BaseModal>

      {/* Modale -- Confirmer la déconnexion */}
      <BaseModal
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
        title="Se déconnecter"
      >
        <Text style={styles.modalWarn}>Veux-tu vraiment te déconnecter ?</Text>
        <View style={styles.modalRow}>
          <SecondaryButton
            label="Annuler"
            onPress={() => setShowLogoutModal(false)}
          />
          <PrimaryButton label="Se déconnecter" onPress={logout} />
        </View>
      </BaseModal>
    </SafeAreaView>
  );
}

/* =============== Sous-composants UI =============== */

function BaseModal({ visible, onRequestClose, title, children }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={{ height: 8 }} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

function SmallButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallBtn,
        pressed && { transform: [{ translateY: 1 }] },
      ]}
    >
      <Text style={styles.smallBtnText}>{label}</Text>
    </Pressable>
  );
}

function SmallButtonDarkFirst({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallBtnDarkFirst,
        pressed && { transform: [{ translateY: 1 }] },
      ]}
    >
      <Text style={styles.smallBtnText}>{label}</Text>
    </Pressable>
  );
}

function SmallButtonDark({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallBtnDark,
        pressed && { transform: [{ translateY: 1 }] },
      ]}
    >
      <Text style={styles.smallBtnText}>{label}</Text>
    </Pressable>
  );
}

function SmallButtonDanger({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallBtnDanger,
        pressed && { transform: [{ translateY: 1 }] },
      ]}
    >
      <Text style={styles.smallBtnText}>{label}</Text>
    </Pressable>
  );
}

function PrimaryButton({ label, onPress, disabled, children }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.6 },
      ]}
    >
      {children || <Text style={styles.primaryBtnText}>{label}</Text>}
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryBtn,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function DangerButton({ label, onPress, disabled, children }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.dangerBtn,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.6 },
      ]}
    >
      {children || <Text style={styles.dangerBtnText}>{label}</Text>}
    </Pressable>
  );
}

/* =============== Styles =============== */

const colors = {
  bg: "#F3E6DF",
  bgSecondary: "#F7F0EC",
  bgTertiary: "#E9D5CD",
  title: "#965A51",
  text: "#2F3437",
  textSecondary: "#6F4A42",
  white: "#FFFFFF",
  smallBtn: "#B4877C",
  smallBtnDark: "#965A51",
  primary: "#8B5E55",
  danger: "#D45248",
  overlay: "rgba(0,0,0,0.35)",
};

const buttonBase = {
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 3px #896761",
};

const styles = StyleSheet.create({
  // === LAYOUT ===
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  actions: {
    gap: 15,
    marginTop: 8,
  },

  // === TYPOGRAPHY ===
  title: {
    color: colors.title,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 16,
  },
  smallBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },

  // === BUTTONS ===
  smallBtn: {
    ...buttonBase,
    backgroundColor: colors.smallBtn,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  smallBtnDarkFirst: {
    ...buttonBase,
    backgroundColor: colors.smallBtnDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 25,
  },
  smallBtnDark: {
    ...buttonBase,
    backgroundColor: colors.smallBtnDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  smallBtnDanger: {
    ...buttonBase,
    backgroundColor: colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  // === MODALS ===
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.bg,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  modalWarn: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  modalRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },

  // === MODAL BUTTONS ===
  primaryBtn: {
    ...buttonBase,
    flex: 1,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: "700",
  },
  secondaryBtn: {
    ...buttonBase,
    flex: 1,
    backgroundColor: colors.bgTertiary,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontWeight: "700",
  },
  dangerBtn: {
    ...buttonBase,
    flex: 1,
    backgroundColor: colors.danger,
  },
  dangerBtnText: {
    color: colors.white,
    fontWeight: "700",
  },
});
