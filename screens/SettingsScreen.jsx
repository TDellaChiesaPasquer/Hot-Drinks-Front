// import { TouchableOpacity, View, Text } from "react-native";
// import { useDispatch } from "react-redux";
// import { disconnect } from "../reducers/user";

// export default function SettingsScreen({ navigation }) {
//   const dispatch = useDispatch();
//   return <View>
//     <TouchableOpacity onPress={() => dispatch(disconnect(navigation))}>
//       <Text>Deconnection</Text>
//     </TouchableOpacity>
//   </View>
// }

// v2

import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, Pressable, Modal, ActivityIndicator, Platform, Alert } from "react-native";
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

	// Garde-fous avant les fetch
	const guardNetwork = () => {
		if (!BASE_URL) {
			Alert.alert("Configuration requise", "EXPO_PUBLIC_IP est manquant. Définissez process.env.EXPO_PUBLIC_IP.");
			return false;
		}
		if (!token) {
			Alert.alert("Session requise", "Aucun token trouvé. Veuillez vous reconnecter.");
			return false;
		}
		return true;
	};

	// ACTION: Changer l'email + déconnexion
	const submitChangeEmail = async () => {
		if (!guardNetwork()) return;
		if (!newEmail) {
			Alert.alert("Email requis", "Veuillez saisir un email.");
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
				body: JSON.stringify({ email: newEmail }),
			});
			const data = await res.json();
			if (!res.ok || data?.result === false) {
				throw new Error(data?.error || "Erreur lors de la modification de l'email");
			}
			setShowEmailModal(false);
			setNewEmail("");
			Alert.alert("Succès", "Email modifié. Vous allez être déconnecté.", [
				{
					text: "OK",
					onPress: () => dispatch(disconnect(navigation)), // Déconnexion automatique
				},
			]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
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
		if (currentPassword.length < 8 || currentPassword.length > 32 || newPassword.length < 8 || newPassword.length > 32) {
			Alert.alert("Mot de passe invalide", "Les mots de passe doivent contenir entre 8 et 32 caractères.");
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
				throw new Error(data?.error || "Erreur lors de la modification du mot de passe");
			}
			setShowPasswordModal(false);
			setCurrentPassword("");
			setNewPassword("");
			Alert.alert("Succès", "Mot de passe modifié. Vous allez être déconnecté.", [
				{
					text: "OK",
					onPress: () => dispatch(disconnect(navigation)),
				},
			]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
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
				throw new Error(data?.error || "Erreur lors de la désactivation du compte");
			}
			setShowDeactivateModal(false);
			Alert.alert("Compte désactivé", "Votre compte a été désactivé. Vous allez être déconnecté.", [
				{
					text: "OK",
					onPress: () => dispatch(disconnect(navigation)), // Déconnexion automatique
				},
			]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
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
				throw new Error(data?.error || "Erreur lors de la suppression du compte");
			}
			setShowDeleteModal(false);
			Alert.alert("Compte supprimé", "Votre compte a été définitivement supprimé.", [
				{
					text: "OK",
					onPress: () => dispatch(disconnect(navigation)), // Déconnexion automatique
				},
			]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<Text style={styles.title}>Réglages</Text>

				<View style={styles.actions}>
					<SmallButton label="Changer l'email" onPress={() => setShowEmailModal(true)} />
					<SmallButton label="Changer le mot de passe" onPress={() => setShowPasswordModal(true)} />
					<SmallButton label="Se déconnecter" onPress={() => setShowLogoutModal(true)} />
					<SmallButton label="Désactiver le compte" onPress={() => setShowDeactivateModal(true)} />
				</View>

				<View style={{ height: 24 }} />
				<Pressable onPress={() => setShowDeleteModal(true)} style={({ pressed }) => [styles.deleteButton, pressed && { transform: [{ translateY: 1 }] }]}>
					<Text style={styles.deleteButtonText}>Supprimer le compte</Text>
				</Pressable>

				<View style={{ height: 40 }} />
			</ScrollView>

			{/* Modale -- Changer l'email */}
			<BaseModal visible={showEmailModal} onRequestClose={() => setShowEmailModal(false)} title="Changer l'email">
				<Text style={styles.modalText}>Nouvel email</Text>
				<TextInput
					style={styles.modalInput}
					value={newEmail}
					onChangeText={setNewEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					placeholder="ex: user@example.com"
					placeholderTextColor="#9f8f88"
				/>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowEmailModal(false)} />
					<PrimaryButton label={emailLoading ? "" : "Valider"} onPress={submitChangeEmail} disabled={emailLoading}>
						{emailLoading && <ActivityIndicator color="#fff" />}
					</PrimaryButton>
				</View>
			</BaseModal>

			{/* Modale -- Changer le mot de passe */}
			<BaseModal visible={showPasswordModal} onRequestClose={() => setShowPasswordModal(false)} title="Changer le mot de passe">
				<Text style={styles.modalText}>Mot de passe actuel</Text>
				<TextInput style={styles.modalInput} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="********" placeholderTextColor="#9f8f88" />
				<Text style={[styles.modalText, { marginTop: 12 }]}>Nouveau mot de passe (8-32)</Text>
				<TextInput style={styles.modalInput} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="********" placeholderTextColor="#9f8f88" />
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowPasswordModal(false)} />
					<PrimaryButton label={passLoading ? "" : "Enregistrer"} onPress={submitChangePassword} disabled={passLoading}>
						{passLoading && <ActivityIndicator color="#fff" />}
					</PrimaryButton>
				</View>
			</BaseModal>

			{/* Modale -- Désactiver le compte */}
			<BaseModal visible={showDeactivateModal} onRequestClose={() => setShowDeactivateModal(false)} title="Désactiver le compte">
				<Text style={styles.modalWarn}>Votre compte sera désactivé. Continuer ?</Text>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowDeactivateModal(false)} />
					<PrimaryButton label={deactivateLoading ? "" : "Désactiver"} onPress={confirmDeactivate} disabled={deactivateLoading}>
						{deactivateLoading && <ActivityIndicator color="#fff" />}
					</PrimaryButton>
				</View>
			</BaseModal>

			{/* Modale -- Supprimer le compte */}
			<BaseModal visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} title="Supprimer le compte">
				<Text style={styles.modalWarn}>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera vos données.</Text>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowDeleteModal(false)} />
					<DangerButton label={deleteLoading ? "" : "Supprimer"} onPress={confirmDelete} disabled={deleteLoading}>
						{deleteLoading && <ActivityIndicator color="#fff" />}
					</DangerButton>
				</View>
			</BaseModal>

			{/* Modale -- Confirmer la déconnexion */}
			<BaseModal visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)} title="Se déconnecter">
				<Text style={styles.modalWarn}>Voulez-vous vraiment vous déconnecter ?</Text>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowLogoutModal(false)} />
					<PrimaryButton label="Se déconnecter" onPress={logout} />
				</View>
			</BaseModal>
		</SafeAreaView>
	);
}

/* =============== Sous-composants UI =============== */

function BaseModal({ visible, onRequestClose, title, children }) {
	return (
		<Modal transparent visible={visible} animationType="fade" onRequestClose={onRequestClose}>
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
		<Pressable onPress={onPress} style={({ pressed }) => [styles.smallBtn, pressed && styles.smallBtnPressed]}>
			<Text style={styles.smallBtnText}>{label}</Text>
		</Pressable>
	);
}

function PrimaryButton({ label, onPress, disabled, children }) {
	return (
		<Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }, disabled && { opacity: 0.6 }]}>
			{children || <Text style={styles.primaryBtnText}>{label}</Text>}
		</Pressable>
	);
}

function SecondaryButton({ label, onPress }) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}>
			<Text style={styles.secondaryBtnText}>{label}</Text>
		</Pressable>
	);
}

function DangerButton({ label, onPress, disabled, children }) {
	return (
		<Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.dangerBtn, pressed && { opacity: 0.9 }, disabled && { opacity: 0.6 }]}>
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
	text: "#6F4A42",
	placeholder: "#9f8f88",
	smallBtnBg: "#B4877C",
	smallBtnText: "#FFFFFF",
	primary: "#8B5E55",
	primaryText: "#FFFFFF",
	danger: "#D45248",
	dangerShadow: "#B43F37",
};

const commonStyles = {
	// Styles de base réutilisables
	buttonBase: {
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
	},
	textBase: {
		fontSize: 14,
		fontWeight: "700",
	},
	shadowBase: {
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
};

const styles = StyleSheet.create({
	// === LAYOUT PRINCIPAL ===
	safe: {
		flex: 1,
		backgroundColor: colors.bg,
	},
	content: {
		flex: 1,
		paddingHorizontal: "5%", // Pdlus relatif que 16px fixe
		paddingVertical: "3%",
	},

	// === TYPOGRAPHIE ===
	title: {
		color: "#965A51",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 10,
		textAlign: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: colors.title,
		textAlign: "center",
		marginBottom: "2%",
	},
	modalText: {
		...commonStyles.textBase,
		color: colors.title,
		marginBottom: "1.5%",
	},
	modalWarn: {
		...commonStyles.textBase,
		color: colors.title,
		lineHeight: 20,
		textAlign: "center",
	},

	// === CONTENEURS ===
	actions: {
		flex: 1,
		justifyContent: "flex-start",
		gap: "2%", // Plus relatif
		marginTop: "2%",
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.35)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: "5%",
	},
	modalCard: {
		width: "100%",
		maxWidth: 400, // Limite sur grands écrans
		borderRadius: 16,
		backgroundColor: colors.bg,
		padding: "4%",
	},
	modalRow: {
		flexDirection: "row",
		marginTop: "4%",
		gap: "3%",
	},

	// === BOUTONS ===
	smallBtn: {
		...commonStyles.buttonBase,
		backgroundColor: colors.smallBtnBg,
		borderRadius: 12,
		paddingVertical: "2.5%",
		paddingHorizontal: "3.5%",
		marginVertical: "1%",
	},
	smallBtnText: {
		...commonStyles.textBase,
		color: colors.smallBtnText,
	},

	deleteButton: {
		...commonStyles.buttonBase,
		...commonStyles.shadowBase,
		alignSelf: "center",
		backgroundColor: colors.danger,
		borderRadius: 14,
		paddingVertical: "3.5%",
		paddingHorizontal: "6%",
		marginVertical: "6%",
		minWidth: "80%", // Plus flexible que width fixe
		maxWidth: "90%",
	},
	deleteButtonText: {
		color: colors.primaryText,
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.2,
	},

	// === BOUTONS MODALES ===
	primaryBtn: {
		...commonStyles.buttonBase,
		flex: 1,
		backgroundColor: colors.primary,
	},
	primaryBtnText: {
		...commonStyles.textBase,
		color: colors.primaryText,
	},

	secondaryBtn: {
		...commonStyles.buttonBase,
		flex: 1,
		backgroundColor: colors.bgTertiary,
	},
	secondaryBtnText: {
		...commonStyles.textBase,
		color: colors.primary,
	},

	dangerBtn: {
		...commonStyles.buttonBase,
		flex: 1,
		backgroundColor: colors.danger,
	},
	dangerBtnText: {
		...commonStyles.textBase,
		color: colors.primaryText,
	},

	// === INPUTS ===
	modalInput: {
		backgroundColor: colors.bgSecondary,
		borderRadius: 10,
		paddingHorizontal: "3%",
		paddingVertical: "3%", // Unifié iOS/Android
		color: colors.text,
		fontSize: 14,
		fontWeight: "600",
		marginBottom: "2%",
	},

	// === ÉTATS INTERACTIFS ===
	pressed: {
		transform: [{ translateY: 1 }],
	},
	disabled: {
		opacity: 0.6,
	},
	loading: {
		opacity: 0.9,
	},
});
