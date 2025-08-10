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

export default function ReglagesScreen() {
	// 1) Récupération du token depuis Redux (adaptez le sélecteur si besoin)
	const token = useSelector((s) => s?.auth?.token);
	const dispatch = useDispatch();

	// 2) Base URL fournie par Expo: N'UTILISER QUE process.env.EXPO_PUBLIC_IP
	const BASE_URL = useMemo(() => {
		const raw = process.env.EXPO_PUBLIC_IP || "";
		return raw.replace(/\/+$/, ""); // retire un slash final éventuel
	}, []);

	// 3) Etats des modales et des formulaires
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

	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [verifyCode, setVerifyCode] = useState("");
	const [verifyLoading, setVerifyLoading] = useState(false);

	// 4) Déconnexion locale: suppression du token dans Redux
	//    Remplacez l'action selon votre store (ex: auth/logout)
	const logout = () => {
		dispatch({ type: "auth/logout" });
		Alert.alert("Déconnexion", "Vous avez été déconnecté.");
	};

	// 5) Garde-fous avant les fetch (config + session)
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

	// 6) ACTION: Changer l'email
	//    Exigences:
	//    - Route: PUT /email
	//    - Header Authorization = token (brut)
	//    - Body: { email }
	//    - Après succès: supprimer le token Redux pour forcer la reconnexion
	const submitChangeEmail = async () => {
		if (!guardNetwork()) return;
		if (!newEmail) {
			Alert.alert("Email requis", "Veuillez saisir un email.");
			return;
		}
		setEmailLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/email`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: token, // IMPORTANT: pas de "Bearer "
				},
				body: JSON.stringify({ email: newEmail }),
			});
			const data = await res.json();
			if (!res.ok || data?.result === false) {
				throw new Error(data?.error || "Erreur lors de la modification de l'email");
			}
			// Succès: on ferme la modale, on vide le champ, puis on force la reconnexion
			setShowEmailModal(false);
			setNewEmail("");
			Alert.alert("Succès", "Email modifié. Veuillez vous reconnecter.", [{ text: "OK", onPress: logout }]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
		} finally {
			setEmailLoading(false);
		}
	};

	// 7) ACTION: Changer le mot de passe
	//    Exigences:
	//    - Route: PUT /password
	//    - Header Authorization = token (brut)
	//    - Body: { currentPassword, password } (8-32 chars chacun)
	//    - Modale demandant le mot de passe actuel + le nouveau
	const submitChangePassword = async () => {
		if (!guardNetwork()) return;
		if (!currentPassword || !newPassword) {
			Alert.alert("Champs requis", "Veuillez remplir les deux champs.");
			return;
		}
		// Respect des contraintes serveur (8-32)
		if (currentPassword.length < 8 || currentPassword.length > 32 || newPassword.length < 8 || newPassword.length > 32) {
			Alert.alert("Mot de passe invalide", "Les mots de passe doivent contenir entre 8 et 32 caractères.");
			return;
		}
		setPassLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/password`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: token, // IMPORTANT: pas de "Bearer "
				},
				body: JSON.stringify({
					currentPassword,
					password: newPassword,
				}),
			});
			const data = await res.json();
			if (!res.ok || data?.result === false) {
				throw new Error(data?.error || "Erreur lors de la modification du mot de passe");
			}
			// Succès: fermer la modale, vider les champs
			setShowPasswordModal(false);
			setCurrentPassword("");
			setNewPassword("");
			Alert.alert("Succès", "Mot de passe modifié.");
			// (Optionnel) Forcer reconnexion ici si vous le souhaitez: logout();
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
		} finally {
			setPassLoading(false);
		}
	};

	// 8) ACTION: Désactiver le compte (confirmation)
	//    - Route: PUT /desactivateAccount
	//    - Header Authorization = token (brut)
	const confirmDeactivate = async () => {
		if (!guardNetwork()) return;
		setDeactivateLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/desactivateAccount`, {
				method: "PUT",
				headers: {
					Authorization: token, // IMPORTANT: pas de "Bearer "
				},
			});
			const data = await res.json();
			if (!res.ok || data?.result === false) {
				throw new Error(data?.error || "Erreur lors de la désactivation du compte");
			}
			setShowDeactivateModal(false);
			Alert.alert("Compte désactivé", "Votre compte a été désactivé.");
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
		} finally {
			setDeactivateLoading(false);
		}
	};

	// 9) ACTION: Supprimer le compte (irréversible)
	//    - Route: DELETE /deleteAccount
	//    - Header Authorization = token (brut)
	//    - Après succès: supprimer le token Redux et informer l'utilisateur
	const confirmDelete = async () => {
		if (!guardNetwork()) return;
		setDeleteLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/deleteAccount`, {
				method: "DELETE",
				headers: {
					Authorization: token, // IMPORTANT: pas de "Bearer "
				},
			});
			const data = await res.json();
			if (!res.ok || data?.result === false) {
				throw new Error(data?.error || "Erreur lors de la suppression du compte");
			}
			setShowDeleteModal(false);
			Alert.alert("Compte supprimé", "Votre compte a été définitivement supprimé.", [{ text: "OK", onPress: logout }]);
		} catch (e) {
			Alert.alert("Erreur", String(e.message || e));
		} finally {
			setDeleteLoading(false);
		}
	};

	// 10) Vérification email (NodeMailer) — UI & placeholders (aucune route fournie)
	const sendVerificationCode = async () => {
		// PLACEHOLDER: reliez à votre endpoint quand il sera disponible
		setVerifyLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 800)); // simulation
			Alert.alert("Code envoyé", "Un code de vérification vous a été envoyé par email.");
		} catch (e) {
			Alert.alert("Erreur", "Impossible d'envoyer le code (endpoint manquant).");
		} finally {
			setVerifyLoading(false);
		}
	};

	const validateVerificationCode = async () => {
		// PLACEHOLDER: reliez à votre endpoint de validation quand disponible
		if (!verifyCode.trim()) {
			Alert.alert("Code manquant", "Veuillez saisir le code de vérification.");
			return;
		}
		setVerifyLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 700)); // simulation
			setShowVerifyModal(false);
			setVerifyCode("");
			Alert.alert("Email vérifié", "Votre adresse email a été vérifiée.");
		} catch (e) {
			Alert.alert("Erreur", "Validation impossible (endpoint manquant).");
		} finally {
			setVerifyLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				{/* Titre conforme au visuel */}
				<Text style={styles.title}>Réglages</Text>

				{/* Boutons demandés uniquement */}
				<View style={styles.actions}>
					<SmallButton label="Changer l'email" onPress={() => setShowEmailModal(true)} />
					<SmallButton label="Changer le mot de passe" onPress={() => setShowPasswordModal(true)} />
					{/* <SmallButton label="Vérifier l'email (code)" onPress={() => setShowVerifyModal(true)} /> */}
					<SmallButton label="Se déconnecter" onPress={logout} />
					<SmallButton label="Désactiver le compte" onPress={() => setShowDeactivateModal(true)} />
				</View>

				{/* Gros bouton rouge “Supprimer le compte” (maquette) */}
				<View style={{ height: 24 }} />
				<Pressable onPress={() => setShowDeleteModal(true)} style={({ pressed }) => [styles.deleteButton, pressed && { transform: [{ translateY: 1 }] }]}>
					<Text style={styles.deleteButtonText}>Supprimer le compte</Text>
				</Pressable>

				<View style={{ height: 40 }} />
			</ScrollView>

			{/* Modale — Changer l'email */}
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

			{/* Modale — Changer le mot de passe (redemande les 2 champs) */}
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

			{/* Modale — Désactiver le compte (confirmation) */}
			<BaseModal visible={showDeactivateModal} onRequestClose={() => setShowDeactivateModal(false)} title="Désactiver le compte">
				<Text style={styles.modalWarn}>Votre compte sera désactivé. Continuer ?</Text>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowDeactivateModal(false)} />
					<PrimaryButton label={deactivateLoading ? "" : "Désactiver"} onPress={confirmDeactivate} disabled={deactivateLoading}>
						{deactivateLoading && <ActivityIndicator color="#fff" />}
					</PrimaryButton>
				</View>
			</BaseModal>

			{/* Modale — Supprimer le compte (irréversible) */}
			<BaseModal visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} title="Supprimer le compte">
				<Text style={styles.modalWarn}>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera vos données.</Text>
				<View style={styles.modalRow}>
					<SecondaryButton label="Annuler" onPress={() => setShowDeleteModal(false)} />
					<DangerButton label={deleteLoading ? "" : "Supprimer"} onPress={confirmDelete} disabled={deleteLoading}>
						{deleteLoading && <ActivityIndicator color="#fff" />}
					</DangerButton>
				</View>
			</BaseModal>

			{/* Modale — Vérifier l'email (NodeMailer) — placeholders front (aucune route fournie) */}
			{/* <BaseModal visible={showVerifyModal} onRequestClose={() => setShowVerifyModal(false)} title="Vérifier l'email">
				<Text style={styles.modalText}>Saisissez le code reçu par email</Text>
				<TextInput
					style={styles.modalInput}
					value={verifyCode}
					onChangeText={setVerifyCode}
					placeholder="Code à 6 chiffres"
					placeholderTextColor="#9f8f88"
					keyboardType="number-pad"
					maxLength={6}
				/>
				<View style={styles.modalRow}>
					<SecondaryButton label="Envoyer code" onPress={sendVerificationCode} />
					<PrimaryButton label={verifyLoading ? "" : "Valider code"} onPress={validateVerificationCode} disabled={verifyLoading}>
						{verifyLoading && <ActivityIndicator color="#fff" />}
					</PrimaryButton>
				</View>
			</BaseModal> */}
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
	title: "#2F3437",
	smallBtnBg: "#B4877C",
	smallBtnText: "#FFFFFF",
	primary: "#8B5E55",
	primaryText: "#FFFFFF",
	danger: "#D45248",
	dangerShadow: "#B43F37",
};

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.bg,
	},
	content: {
		paddingHorizontal: 16,
		paddingTop: 24,
		paddingBottom: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: colors.title,
		textAlign: "center",
		marginBottom: 18,
	},
	actions: {
		marginTop: 8,
		gap: 8,
	},
	smallBtn: {
		backgroundColor: colors.smallBtnBg,
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 14,
		alignItems: "center",
		justifyContent: "center",
	},
	smallBtnPressed: {
		transform: [{ translateY: 1 }],
	},
	smallBtnText: {
		color: colors.smallBtnText,
		fontSize: 14,
		fontWeight: "700",
	},
	deleteButton: {
		alignSelf: "center",
		backgroundColor: colors.danger,
		borderRadius: 14,
		paddingVertical: 14,
		paddingHorizontal: 24,
		width: "85%",
		alignItems: "center",
		...Platform.select({
			ios: { shadowColor: colors.dangerShadow, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } },
			android: { elevation: 3 },
		}),
	},
	deleteButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.2,
	},
	// Modales
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.35)",
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
		color: colors.title,
		textAlign: "center",
	},
	modalText: {
		fontSize: 14,
		color: colors.title,
		marginBottom: 6,
	},
	modalWarn: {
		fontSize: 14,
		color: colors.title,
		lineHeight: 20,
		textAlign: "center",
	},
	modalInput: {
		backgroundColor: "#F7F0EC",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: Platform.select({ ios: 12, android: 10 }),
		color: "#6F4A42",
		fontSize: 14,
		fontWeight: "600",
	},
	modalRow: {
		marginTop: 14,
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	primaryBtn: {
		flex: 1,
		backgroundColor: colors.primary,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	primaryBtnText: {
		color: colors.primaryText,
		fontWeight: "700",
	},
	secondaryBtn: {
		flex: 1,
		backgroundColor: "#E9D5CD",
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	secondaryBtnText: {
		color: colors.primary,
		fontWeight: "700",
	},
	dangerBtn: {
		flex: 1,
		backgroundColor: colors.danger,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	dangerBtnText: {
		color: "#fff",
		fontWeight: "700",
	},
});
